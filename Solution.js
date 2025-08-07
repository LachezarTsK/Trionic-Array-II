
/**
 * @param {number[]} input
 * @return {number}
 */
var maxSumTrionic = function (input) {
    const sumOfValuesPerSlope = createSumOfValuesPerSlope(input);
    return findMaxSumOfTrionicArray(sumOfValuesPerSlope);
};

/**
 * @param {number[][]} sumOfValuesPerSlope
 * @return {number}
 */
function findMaxSumOfTrionicArray(sumOfValuesPerSlope) {
    let maxSum = Number.MIN_SAFE_INTEGER;
    let front = 2;
    let back = 0;

    if (isTrionicArray(back, front, sumOfValuesPerSlope)) {
        maxSum = Math.max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope));
    }
    ++front;
    ++back;

    while (front < sumOfValuesPerSlope.length) {
        if (isTrionicArray(back, front, sumOfValuesPerSlope)) {
            maxSum = Math.max(maxSum, getSumOfTrionicArray(back, front, sumOfValuesPerSlope));
        }
        ++front;
        ++back;
    }
    return maxSum;
}

/**
 * @param {number} back
 * @param {number} front
 * @param {number[][]} sumOfValuesPerSlope
 * @return {number}
 */
function getSumOfTrionicArray(back, front, sumOfValuesPerSlope) {
    let sum = 0;
    sum += sumOfValuesPerSlope[back][0];
    sum += sumOfValuesPerSlope[back + 1][0];
    sum += sumOfValuesPerSlope[front][1];
    return sum;
}

/**
 * @param {number} back
 * @param {number} front
 * @param {number[][]} sumOfValuesPerSlope
 * @return {boolean}
 */
function isTrionicArray(back, front, sumOfValuesPerSlope) {
    return sumOfValuesPerSlope[back][2] === Util.INCREASING
            && sumOfValuesPerSlope[back + 1][2] === Util.DECREASING
            && sumOfValuesPerSlope[front][2] === Util.INCREASING;
}

/**
 * @param {number[]} input
 * @return {number[][]}
 */
function createSumOfValuesPerSlope(input) {
    const sumOfValuesPerSlope = new Array();
    let index = 0;

    while (index < input.length - 1) {
        index = processIncreasingSlope(sumOfValuesPerSlope, input, index);
        index = processDecreasingSlope(sumOfValuesPerSlope, input, index);
        index = processHorizontalSection(sumOfValuesPerSlope, input, index);
    }
    return sumOfValuesPerSlope;
}

/**
 * @param {number[][]} sumOfValuesPerSlope
 * @param {number[]} input
 * @param {number} index
 * @return {number}
 */
function processIncreasingSlope(sumOfValuesPerSlope, input, index) {
    let maxSumWhenIncreasingSlopeIsAtStart = 0;
    let maxSumWhenIncreasingSlopeIsAtEnd = 0;
    let sumAllValuesInIncreasingSlope = 0;
    let increasingSlopeFound = false;

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
        const startSum = maxSumWhenIncreasingSlopeIsAtStart + input[index];
        const endSum = Math.max(sumAllValuesInIncreasingSlope + input[index], maxSumWhenIncreasingSlopeIsAtEnd);
        sumOfValuesPerSlope.push([startSum, endSum, Util.INCREASING]);
    }

    return index;
}

/**
 * @param {number[][]} sumOfValuesPerSlope
 * @param {number[]} input
 * @param {number} index
 * @return {number}
 */
function processDecreasingSlope(sumOfValuesPerSlope, input, index) {
    let sum = 0;
    let lastValueFromIncreasing = input[index];
    let decreasingSlopeFound = false;
    while (index < input.length - 1 && input[index] > input[index + 1]) {
        sum += input[index];
        decreasingSlopeFound = true;
        ++index;
    }

    if (decreasingSlopeFound) {
        sumOfValuesPerSlope.push([sum - lastValueFromIncreasing, Util.PLACEHOLDER_VALUE, Util.DECREASING]);
    }
    return index;
}

/**
 * @param {number[][]} sumOfValuesPerSlope
 * @param {number[]} input
 * @param {number} index
 * @return {number}
 */
function processHorizontalSection(sumOfValuesPerSlope, input, index) {
    let horizontalSectionFound = false;
    while (index < input.length - 1 && input[index] === input[index + 1]) {
        horizontalSectionFound = true;
        ++index;
    }

    if (horizontalSectionFound) {
        sumOfValuesPerSlope.push([Util.PLACEHOLDER_VALUE, Util.PLACEHOLDER_VALUE, Util.HORIZONTAL]);
    }
    return index;
}

class Util {
    static INCREASING = 1;
    static DECREASING = -1;
    static HORIZONTAL = 0;
    static PLACEHOLDER_VALUE = 0;
}
