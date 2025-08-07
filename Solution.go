
package main
import "math"

const INCREASING int64 = 1
const DECREASING int64 = -1
const HORIZONTAL int64 = 0
const PLACEHOLDER_VALUE int64 = 0

func maxSumTrionic(input []int) int64 {
    var sumOfValuesPerSlope [][]int64 = createSumOfValuesPerSlope(input)
    return findMaxSumOfTrionicArray(sumOfValuesPerSlope)
}

func findMaxSumOfTrionicArray(sumOfValuesPerSlope [][]int64) int64 {
    var maxSum int64 = math.MinInt64
    front := 2
    back := 0

    if isTrionicArray(back, front, sumOfValuesPerSlope) {
        maxSum = max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope))
    }
    front++
    back++

    for front < len(sumOfValuesPerSlope) {
        if isTrionicArray(back, front, sumOfValuesPerSlope) {
            maxSum = max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope))
        }
        front++
        back++
    }
    return maxSum
}

func getSumOfTrionicArray(back int, front int, sumOfValuesPerSlope [][]int64) int64 {
    var sum int64 = 0
    sum += sumOfValuesPerSlope[back][0]
    sum += sumOfValuesPerSlope[back + 1][0]
    sum += sumOfValuesPerSlope[front][1]
    return sum
}

func isTrionicArray(back int, front int, sumOfValuesPerSlope [][]int64) bool {
    return sumOfValuesPerSlope[back][2] == INCREASING &&
            sumOfValuesPerSlope[back + 1][2] == DECREASING &&
            sumOfValuesPerSlope[front][2] == INCREASING
}

func createSumOfValuesPerSlope(input []int) [][]int64 {
    sumOfValuesPerSlope := [][]int64{}
    index := 0

    for index < len(input) - 1 {
        index = processIncreasingSlope(&sumOfValuesPerSlope, input, index)
        index = processDecreasingSlope(&sumOfValuesPerSlope, input, index)
        index = processHorizontalSection(&sumOfValuesPerSlope, input, index)
    }
    return sumOfValuesPerSlope
}

func processIncreasingSlope(sumOfValuesPerSlope *[][]int64, input []int, index int) int {
    var maxSumWhenIncreasingSlopeIsAtStart int64 = 0
    var maxSumWhenIncreasingSlopeIsAtEnd int64 = 0
    var sumAllValuesInIncreasingSlope int64 = 0
    increasingSlopeFound := false

    for index < len(input) - 1 && input[index] < input[index + 1] {

        sumAllValuesInIncreasingSlope += int64(input[index])

        if input[index] < 0 {
            maxSumWhenIncreasingSlopeIsAtStart = int64(input[index])
        } else {
            maxSumWhenIncreasingSlopeIsAtStart = max(maxSumWhenIncreasingSlopeIsAtStart, int64(0)) + int64(input[index])
        }

        if !increasingSlopeFound {
            maxSumWhenIncreasingSlopeIsAtEnd = int64(input[index] + input[index + 1])
        }

        index++
        increasingSlopeFound = true
    }

    if increasingSlopeFound {
        startSum := maxSumWhenIncreasingSlopeIsAtStart + int64(input[index])
        endSum := max(sumAllValuesInIncreasingSlope + int64(input[index]), maxSumWhenIncreasingSlopeIsAtEnd)
        *sumOfValuesPerSlope = append(*sumOfValuesPerSlope, []int64{startSum, endSum, INCREASING})
    }

    return index
}

func processDecreasingSlope(sumOfValuesPerSlope *[][]int64, input []int, index int) int {
    var sum int64 = 0
    lastValueFromIncreasing := int64(input[index])
    decreasingSlopeFound := false
    for index < len(input) - 1 && input[index] > input[index + 1] {
        sum += int64(input[index])
        decreasingSlopeFound = true
        index++
    }

    if decreasingSlopeFound {
        *sumOfValuesPerSlope = append(*sumOfValuesPerSlope, []int64{int64(sum - lastValueFromIncreasing), PLACEHOLDER_VALUE, DECREASING})
    }
    return index
}

func processHorizontalSection(sumOfValuesPerSlope *[][]int64, input []int, index int) int {
    horizontalSectionFound := false
    for index < len(input) - 1 && input[index] == input[index + 1] {
        horizontalSectionFound = true
        index++
    }

    if horizontalSectionFound {
        *sumOfValuesPerSlope = append(*sumOfValuesPerSlope, []int64{PLACEHOLDER_VALUE, PLACEHOLDER_VALUE, HORIZONTAL})
    }
    return index
}
