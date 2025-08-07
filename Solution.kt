
import kotlin.math.max

class Solution {

    private companion object {
        const val INCREASING: Long = 1
        const val DECREASING: Long = -1
        const val HORIZONTAL: Long = 0
        const val PLACEHOLDER_VALUE: Long = 0
    }

    fun maxSumTrionic(input: IntArray): Long {
        val sumOfValuesPerSlope: MutableList<LongArray> = createSumOfValuesPerSlope(input)
        return findMaxSumOfTrionicArray(sumOfValuesPerSlope)
    }

    private fun findMaxSumOfTrionicArray(sumOfValuesPerSlope: MutableList<LongArray>): Long {
        var maxSum = Long.MIN_VALUE
        var front = 2
        var back = 0

        if (isTrionicArray(back, front, sumOfValuesPerSlope)) {
            maxSum = max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope))
        }
        ++front
        ++back

        while (front < sumOfValuesPerSlope.size) {
            if (isTrionicArray(back, front, sumOfValuesPerSlope)) {
                maxSum = max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope))
            }
            ++front
            ++back
        }
        return maxSum
    }

    private fun getSumOfTrionicArray(back: Int, front: Int, sumOfValuesPerSlope: MutableList<LongArray>): Long {
        var sum: Long = 0
        sum += sumOfValuesPerSlope[back][0]
        sum += sumOfValuesPerSlope[back + 1][0]
        sum += sumOfValuesPerSlope[front][1]
        return sum
    }

    private fun isTrionicArray(back: Int, front: Int, sumOfValuesPerSlope: MutableList<LongArray>): Boolean {
        return sumOfValuesPerSlope[back][2] == INCREASING
                && sumOfValuesPerSlope[back + 1][2] == DECREASING
                && sumOfValuesPerSlope[front][2] == INCREASING
    }

    private fun createSumOfValuesPerSlope(input: IntArray): MutableList<LongArray> {
        val sumOfValuesPerSlope = mutableListOf<LongArray>()
        var index = 0

        while (index < input.size - 1) {
            index = processIncreasingSlope(sumOfValuesPerSlope, input, index)
            index = processDecreasingSlope(sumOfValuesPerSlope, input, index)
            index = processHorizontalSection(sumOfValuesPerSlope, input, index)
        }
        return sumOfValuesPerSlope
    }

    private fun processIncreasingSlope(sumOfValuesPerSlope: MutableList<LongArray>, input: IntArray, index: Int): Int {
        var index = index
        var maxSumWhenIncreasingSlopeIsAtStart: Long = 0
        var maxSumWhenIncreasingSlopeIsAtEnd: Long = 0
        var sumAllValuesInIncreasingSlope: Long = 0
        var increasingSlopeFound = false

        while (index < input.size - 1 && input[index] < input[index + 1]) {

            sumAllValuesInIncreasingSlope += input[index]

            if (input[index] < 0) {
                maxSumWhenIncreasingSlopeIsAtStart = input[index].toLong()
            } else {
                maxSumWhenIncreasingSlopeIsAtStart = max(maxSumWhenIncreasingSlopeIsAtStart, 0) + input[index]
            }

            if (!increasingSlopeFound) {
                maxSumWhenIncreasingSlopeIsAtEnd = input[index] + input[index + 1].toLong()
            }

            ++index
            increasingSlopeFound = true
        }

        if (increasingSlopeFound) {
            val startSum = maxSumWhenIncreasingSlopeIsAtStart + input[index]
            val endSum = max(sumAllValuesInIncreasingSlope + input[index], maxSumWhenIncreasingSlopeIsAtEnd)
            sumOfValuesPerSlope.add(longArrayOf(startSum, endSum, INCREASING))
        }

        return index
    }

    private fun processDecreasingSlope(sumOfValuesPerSlope: MutableList<LongArray>, input: IntArray, index: Int): Int {
        var index = index
        var sum: Long = 0
        var lastValueFromIncreasing = input[index]
        var decreasingSlopeFound = false
        while (index < input.size - 1 && input[index] > input[index + 1]) {
            sum += input[index]
            decreasingSlopeFound = true
            ++index
        }

        if (decreasingSlopeFound) {
            sumOfValuesPerSlope.add(longArrayOf(sum - lastValueFromIncreasing, PLACEHOLDER_VALUE, DECREASING))
        }
        return index
    }

    private fun processHorizontalSection(sumOfValuesPerSlope: MutableList<LongArray>, input: IntArray, index: Int): Int {
        var index = index
        var horizontalSectionFound = false
        while (index < input.size - 1 && input[index] == input[index + 1]) {
            horizontalSectionFound = true
            ++index
        }

        if (horizontalSectionFound) {
            sumOfValuesPerSlope.add(longArrayOf(PLACEHOLDER_VALUE, PLACEHOLDER_VALUE, HORIZONTAL))
        }
        return index
    }
}
