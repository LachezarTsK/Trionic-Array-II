# Trionic-Array-II
Challenge at LeetCode.com. Tags: Sliding Window, Math, Design.

----------------------------------------------------------------------------------------------------------------------------------------------------------------

The input range includes both negative and non-negative values and the problem defines a trionic array, as an array with three slopes. At the start: strictly increasing. At the middle: strictly decreasing. At the end: strictly increasing. 

To achieve maximum sum, this necessitates special handling of the strictly increasing sections, depending on whether it is at the start or at the end of the trionic array. 

The middle section is handled normally, i.e. all values are included in the sum, since not selecting one or more values in this section will leave a gap and then the array will not be trionic. 


Cases when the strictly increasing array is at the start.

1.	All values are non-negative. Example: 0, 1, 2, 3, 4, 5.
In this case, all values are included in the sum.

2.	Negative values precede the non-negative. Example: -4, -2, -1, 5, 6, 8.
In this case, all negative values are skipped and only the non-negative ones are selected. 

3.	All values are negative. Example: -6, -5, -4, -3, -2, -1.
In this case, only the last two values are selected, so that there is still an increasing slope,
and yet, the sum of this slope has maximum value.


Cases when the strictly increasing array is at the end.

1. All values are non-negative. Example: 0, 1, 2, 3, 4, 5.
In this case all values are included in the sum.

2. Negative values precede the non-negative.

2.1. Subcase when the sum of all negative and non-negative values is less than the sum of the
first two negative values. Example: -5, -4, -3, -2, -1, 0, 1, 2 where (- 5 - 4) > (- 5 - 4 - 3 - 2 - 1 + 0 + 1 + 2)
In this case, only the first two negative values are selected, and the rest are skipped, so that there is still an increasing slope, and yet, the sum of this slope has maximum value.

2.2. Subcase when the sum of all negative and non-negative values is greater than the sum of the
first two negative values. Example: -5, -4, -3, -2, -1, 0, 100, 200 where (- 5 - 4) < (- 5 - 4 - 3 - 2 - 1 + 0 + 100 + 200) In this case, obviously, all values are selected.

3. All values are negative. Example: -6, -5, -4, -3, -2, -1.
In this case, just as in case 2.1, only the first two negative values are selected.

In the trionic array, the end value of the first increasing slope is shared with the start value of the decreasing slope, and the end value of the decreasing slope is shared with the start value of the second increasing slope. To avoid double counting, these shared values are counted towards the increasing slopes. 

Example: 1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5. 
First increasing sum: (1 + 2 + 3 + 4 + 5). Decreasing sum: (4 + 3 + 2). Second increasing sum: (1 + 2 + 3 + 4 + 5). 

Considering all these details to calculate the sum of a slope, a list is created where each element of the list represents the sum of a particular slope, increasing, decreasing, or horizontal (which has a value 0 and is not included in the calculations). Each element is marked with either -1 for decreasing, or 1 for increasing, or 0 for horizontal section. 

Then a sliding window of size 3 is applied on this list. Size 3 stands for three consecutive sections with different slopes. If the current area of the window covers a trionic array, its sum is calculated. The solution to the problem is the maximum sum of all those sums for trionic arrays. 
