
function maxSumTrionic(input: number[]): number {
    const sumOfValuesPerSlope = createSumOfValuesPerSlope(input);
    return findMaxSumOfTrionicArray(sumOfValuesPerSlope);
};

function findMaxSumOfTrionicArray(sumOfValuesPerSlope: number[][]): number {
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

function getSumOfTrionicArray(back: number, front: number, sumOfValuesPerSlope: number[][]) {
    let sum = 0;
    sum += sumOfValuesPerSlope[back][0];
    sum += sumOfValuesPerSlope[back + 1][0];
    sum += sumOfValuesPerSlope[front][1];
    return sum;
}

function isTrionicArray(back: number, front: number, sumOfValuesPerSlope: number[][]) {
    return sumOfValuesPerSlope[back][2] === Util.INCREASING
        && sumOfValuesPerSlope[back + 1][2] === Util.DECREASING
        && sumOfValuesPerSlope[front][2] === Util.INCREASING;
}

function createSumOfValuesPerSlope(input: number[]): number[][] {
    const sumOfValuesPerSlope = new Array();
    let index = 0;

    while (index < input.length - 1) {
        index = processIncreasingSlope(sumOfValuesPerSlope, input, index);
        index = processDecreasingSlope(sumOfValuesPerSlope, input, index);
        index = processHorizontalSection(sumOfValuesPerSlope, input, index);
    }
    return sumOfValuesPerSlope;
}

function processIncreasingSlope(sumOfValuesPerSlope: number[][], input: number[], index) {
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

function processDecreasingSlope(sumOfValuesPerSlope: number[][], input: number[], index: number): number {
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

function processHorizontalSection(sumOfValuesPerSlope: number[][], input: number[], index: number): number {
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
