
import java.util.ArrayList;
import java.util.List;

public class Solution {

    private static final int INCREASING = 1;
    private static final int DECREASING = -1;
    private static final int HORIZONTAL = 0;
    private static final int PLACEHOLDER_VALUE = 0;

    public long maxSumTrionic(int[] input) {
        List<long[]> sumOfValuesPerSlope = createSumOfValuesPerSlope(input);
        return findMaxSumOfTrionicArray(sumOfValuesPerSlope);
    }

    private long findMaxSumOfTrionicArray(List<long[]> sumOfValuesPerSlope) {
        long maxSum = Long.MIN_VALUE;
        int front = 2;
        int back = 0;

        if (isTrionicArray(back, front, sumOfValuesPerSlope)) {
            maxSum = Math.max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope));
        }
        ++front;
        ++back;

        while (front < sumOfValuesPerSlope.size()) {
            if (isTrionicArray(back, front, sumOfValuesPerSlope)) {
                maxSum = Math.max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope));
            }
            ++front;
            ++back;
        }
        return maxSum;
    }

    private long getSumOfTrionicArray(int back, int front, List<long[]> sumOfValuesPerSlope) {
        long sum = 0;
        sum += sumOfValuesPerSlope.get(back)[0];
        sum += sumOfValuesPerSlope.get(back + 1)[0];
        sum += sumOfValuesPerSlope.get(front)[1];
        return sum;
    }

    private boolean isTrionicArray(int back, int front, List<long[]> sumOfValuesPerSlope) {
        return sumOfValuesPerSlope.get(back)[2] == INCREASING
                && sumOfValuesPerSlope.get(back + 1)[2] == DECREASING
                && sumOfValuesPerSlope.get(front)[2] == INCREASING;
    }

    private List<long[]> createSumOfValuesPerSlope(int[] input) {
        List<long[]> sumOfValuesPerSlope = new ArrayList<>();
        int index = 0;

        while (index < input.length - 1) {
            index = processIncreasingSlope(sumOfValuesPerSlope, input, index);
            index = processDecreasingSlope(sumOfValuesPerSlope, input, index);
            index = processHorizontalSection(sumOfValuesPerSlope, input, index);
        }
        return sumOfValuesPerSlope;
    }

    private int processIncreasingSlope(List<long[]> sumOfValuesPerSlope, int[] input, int index) {
        long maxSumWhenIncreasingSlopeIsAtStart = 0;
        long maxSumWhenIncreasingSlopeIsAtEnd = 0;
        long sumAllValuesInIncreasingSlope = 0;
        boolean increasingSlopeFound = false;

        while (index < input.length - 1 && input[index] < input[index + 1]) {

            sumAllValuesInIncreasingSlope += input[index];

            if (input[index] < 0) {
                maxSumWhenIncreasingSlopeIsAtStart = input[index];
            } else {
                maxSumWhenIncreasingSlopeIsAtStart = Math.max(maxSumWhenIncreasingSlopeIsAtStart, 0) + input[index];
            }

            if (!increasingSlopeFound) {
                maxSumWhenIncreasingSlopeIsAtEnd = input[index] + input[index + 1];
            }

            ++index;
            increasingSlopeFound = true;
        }

        if (increasingSlopeFound) {
            long startSum = maxSumWhenIncreasingSlopeIsAtStart + input[index];
            long endSum = Math.max(sumAllValuesInIncreasingSlope + input[index], maxSumWhenIncreasingSlopeIsAtEnd);
            sumOfValuesPerSlope.add(new long[]{startSum, endSum, INCREASING});
        }

        return index;
    }

    private int processDecreasingSlope(List<long[]> sumOfValuesPerSlope, int[] input, int index) {
        long sum = 0;
        int lastValueFromIncreasing = input[index];
        boolean decreasingSlopeFound = false;
        while (index < input.length - 1 && input[index] > input[index + 1]) {
            sum += input[index];
            decreasingSlopeFound = true;
            ++index;
        }

        if (decreasingSlopeFound) {
            sumOfValuesPerSlope.add(new long[]{sum - lastValueFromIncreasing, PLACEHOLDER_VALUE, DECREASING});
        }
        return index;
    }

    private int processHorizontalSection(List<long[]> sumOfValuesPerSlope, int[] input, int index) {
        boolean horizontalSectionFound = false;
        while (index < input.length - 1 && input[index] == input[index + 1]) {
            horizontalSectionFound = true;
            ++index;
        }

        if (horizontalSectionFound) {
            sumOfValuesPerSlope.add(new long[]{PLACEHOLDER_VALUE, PLACEHOLDER_VALUE, HORIZONTAL});
        }
        return index;
    }
}
