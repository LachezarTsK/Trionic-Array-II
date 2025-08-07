
using System;
using System.Collections.Generic;

public class Solution
{
    private static readonly int INCREASING = 1;
    private static readonly int DECREASING = -1;
    private static readonly int HORIZONTAL = 0;
    private static readonly int PLACEHOLDER_VALUE = 0;

    public long MaxSumTrionic(int[] input)
    {
        List<long[]> sumOfValuesPerSlope = CreateSumOfValuesPerSlope(input);
        return FindMaxSumOfTrionicArray(sumOfValuesPerSlope);
    }

    private long FindMaxSumOfTrionicArray(List<long[]> sumOfValuesPerSlope)
    {
        long maxSum = long.MinValue;
        int front = 2;
        int back = 0;

        if (IsTrionicArray(back, front, sumOfValuesPerSlope))
        {
            maxSum = Math.Max(maxSum, GetSumOfTrionicArray(back, front, sumOfValuesPerSlope));
        }
        ++front;
        ++back;

        while (front < sumOfValuesPerSlope.Count)
        {
            if (IsTrionicArray(back, front, sumOfValuesPerSlope))
            {
                maxSum = Math.Max(maxSum, GetSumOfTrionicArray(back, front, sumOfValuesPerSlope));
            }
            ++front;
            ++back;
        }
        return maxSum;
    }
    private long GetSumOfTrionicArray(int back, int front, List<long[]> sumOfValuesPerSlope)
    {
        long sum = 0;
        sum += sumOfValuesPerSlope[back][0];
        sum += sumOfValuesPerSlope[back + 1][0];
        sum += sumOfValuesPerSlope[front][1];
        return sum;
    }

    private bool IsTrionicArray(int back, int front, List<long[]> sumOfValuesPerSlope)
    {
        return sumOfValuesPerSlope[back][2] == INCREASING
                && sumOfValuesPerSlope[back + 1][2] == DECREASING
                && sumOfValuesPerSlope[front][2] == INCREASING;
    }

    public List<long[]> CreateSumOfValuesPerSlope(int[] input)
    {
        List<long[]> sumOfValuesPerSlope = new List<long[]>();
        int index = 0;

        while (index < input.Length - 1)
        {
            index = ProcessIncreasingSlope(sumOfValuesPerSlope, input, index);
            index = ProcessDecreasingSlope(sumOfValuesPerSlope, input, index);
            index = ProcessHorizontalSection(sumOfValuesPerSlope, input, index);
        }
        return sumOfValuesPerSlope;
    }

    private int ProcessIncreasingSlope(List<long[]> sumOfValuesPerSlope, int[] input, int index)
    {
        long maxSumWhenIncreasingSlopeIsAtStart = 0;
        long maxSumWhenIncreasingSlopeIsAtEnd = 0;
        long sumAllValuesInIncreasingSlope = 0;
        bool increasingSlopeFound = false;

        while (index < input.Length - 1 && input[index] < input[index + 1])
        {

            sumAllValuesInIncreasingSlope += input[index];

            if (input[index] < 0)
            {
                maxSumWhenIncreasingSlopeIsAtStart = input[index];
            }
            else
            {
                maxSumWhenIncreasingSlopeIsAtStart = Math.Max(maxSumWhenIncreasingSlopeIsAtStart, 0) + input[index];
            }

            if (!increasingSlopeFound)
            {
                maxSumWhenIncreasingSlopeIsAtEnd = input[index] + input[index + 1];
            }

            ++index;
            increasingSlopeFound = true;
        }

        if (increasingSlopeFound)
        {
            long startSum = maxSumWhenIncreasingSlopeIsAtStart + input[index];
            long endSum = Math.Max(sumAllValuesInIncreasingSlope + input[index], maxSumWhenIncreasingSlopeIsAtEnd);
            sumOfValuesPerSlope.Add(new long[] { startSum, endSum, INCREASING });
        }

        return index;
    }

    private int ProcessDecreasingSlope(List<long[]> sumOfValuesPerSlope, int[] input, int index)
    {
        long sum = 0;
        int lastValueFromIncreasing = input[index];
        bool decreasingSlopeFound = false;
        while (index < input.Length - 1 && input[index] > input[index + 1])
        {
            sum += input[index];
            decreasingSlopeFound = true;
            ++index;
        }

        if (decreasingSlopeFound)
        {
            sumOfValuesPerSlope.Add(new long[] { sum - lastValueFromIncreasing, PLACEHOLDER_VALUE, DECREASING });
        }
        return index;
    }

    private int ProcessHorizontalSection(List<long[]> sumOfValuesPerSlope, int[] input, int index)
    {
        bool horizontalSectionFound = false;
        while (index < input.Length - 1 && input[index] == input[index + 1])
        {
            horizontalSectionFound = true;
            ++index;
        }

        if (horizontalSectionFound)
        {
            sumOfValuesPerSlope.Add(new long[] { PLACEHOLDER_VALUE, PLACEHOLDER_VALUE, HORIZONTAL });
        }
        return index;
    }
}
