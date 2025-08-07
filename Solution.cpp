
#include <span>
#include <limits>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {

    const static int INCREASING = 1;
    const static int DECREASING = -1;
    const static int HORIZONTAL = 0;
    const static int PLACEHOLDER_VALUE = 0;

public:
    long long maxSumTrionic(const vector<int>& input) const {
        vector<vector<long long>> sumOfValuesPerSlope = createSumOfValuesPerSlope(input);
        return findMaxSumOfTrionicArray(sumOfValuesPerSlope);
    }

private:
    long long findMaxSumOfTrionicArray(span<const vector<long long>> sumOfValuesPerSlope) const {
        long long maxSum = numeric_limits<long long>::min();
        int front = 2;
        int back = 0;

        if (isTrionicArray(back, front, sumOfValuesPerSlope)) {
            maxSum = max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope));
        }
        ++front;
        ++back;

        while (front < sumOfValuesPerSlope.size()) {
            if (isTrionicArray(back, front, sumOfValuesPerSlope)) {
                maxSum = max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope));
            }
            ++front;
            ++back;
        }
        return maxSum;
    }

    long long getSumOfTrionicArray(int back, int front, span<const vector<long long>> sumOfValuesPerSlope) const {
        long sum = 0;
        sum += sumOfValuesPerSlope[back][0];
        sum += sumOfValuesPerSlope[back + 1][0];
        sum += sumOfValuesPerSlope[front][1];
        return sum;
    }

    bool isTrionicArray(int back, int front, span<const vector<long long>> sumOfValuesPerSlope) const {
        return sumOfValuesPerSlope[back][2] == INCREASING
                && sumOfValuesPerSlope[back + 1][2] == DECREASING
                && sumOfValuesPerSlope[front][2] == INCREASING;
    }

    vector<vector<long long>> createSumOfValuesPerSlope(span<const int> input) const {
        vector<vector<long long>> sumOfValuesPerSlope;
        int index = 0;

        while (index < input.size() - 1) {
            index = processIncreasingSlope(sumOfValuesPerSlope, input, index);
            index = processDecreasingSlope(sumOfValuesPerSlope, input, index);
            index = processHorizontalSection(sumOfValuesPerSlope, input, index);
        }
        return sumOfValuesPerSlope;
    }

    int processIncreasingSlope(vector<vector<long long>>& sumOfValuesPerSlope, span<const int> input, int index) const {
        long long maxSumWhenIncreasingSlopeIsAtStart = 0;
        long long maxSumWhenIncreasingSlopeIsAtEnd = 0;
        long long sumAllValuesInIncreasingSlope = 0;
        bool increasingSlopeFound = false;

        while (index < input.size() - 1 && input[index] < input[index + 1]) {

            sumAllValuesInIncreasingSlope += input[index];

            if (input[index] < 0) {
                maxSumWhenIncreasingSlopeIsAtStart = input[index];
            }
            else {
                maxSumWhenIncreasingSlopeIsAtStart = max(maxSumWhenIncreasingSlopeIsAtStart, 0LL) + input[index];
            }

            if (!increasingSlopeFound) {
                maxSumWhenIncreasingSlopeIsAtEnd = input[index] + input[index + 1];
            }

            ++index;
            increasingSlopeFound = true;
        }

        if (increasingSlopeFound) {
            long long startSum = maxSumWhenIncreasingSlopeIsAtStart + input[index];
            long long endSum = max(sumAllValuesInIncreasingSlope + input[index], maxSumWhenIncreasingSlopeIsAtEnd);
            sumOfValuesPerSlope.push_back(vector<long long>{startSum, endSum, INCREASING});
        }

        return index;
    }

    int processDecreasingSlope(vector<vector<long long>>& sumOfValuesPerSlope, span<const int> input, int index) const {
        long long sum = 0;
        int lastValueFromIncreasing = input[index];
        bool decreasingSlopeFound = false;
        while (index < input.size() - 1 && input[index] > input[index + 1]) {
            sum += input[index];
            decreasingSlopeFound = true;
            ++index;
        }

        if (decreasingSlopeFound) {
            sumOfValuesPerSlope.push_back(vector<long long>{sum - lastValueFromIncreasing, PLACEHOLDER_VALUE, DECREASING});
        }
        return index;
    }

    int processHorizontalSection(vector<vector<long long>>& sumOfValuesPerSlope, span<const int> input, int index) const {
        bool horizontalSectionFound = false;
        while (index < input.size() - 1 && input[index] == input[index + 1]) {
            horizontalSectionFound = true;
            ++index;
        }

        if (horizontalSectionFound) {
            sumOfValuesPerSlope.push_back(vector<long long>{PLACEHOLDER_VALUE, PLACEHOLDER_VALUE, HORIZONTAL});
        }
        return index;
    }
};
