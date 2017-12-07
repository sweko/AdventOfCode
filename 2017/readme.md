# Advent of code - 2017
So, the story this year is Tron-like. We need to fix the printer for the Naughty or Nice List, and we only have 25 milliseconds until midnight.
But as we're sucked into Santa's computer that's plenty of time.

I will be solving the tasks using TypeScript.

## [Day 01 - Inverse Captcha](http://adventofcode.com/2017/day/1)
Ok, getting our toes wet. We have to solve a CAPTCHA, but the other way around - we need to prove that we are a computer instead of a human (or elf).
The input is a (circular) series of digits.

### Part 1
The task is to find how many digits are identical to the one preceeding them, with wrapping.
A simple way to avoid weird index math, is to add the first index to the end of the list, and then process all items that have a successor.
If the successor is identical to the current index, add it to the sum, and that's it.

### Part 2
The task is to find how many digits are identical to the one halfway around the list, with wrapping.
We're also guaranteed that the list has an even number of elements.
So, what we can do is slice the list in two halfs, and go, index by index, throught them simultaneously.
That's usually done with the `zip` method, but JavaScript (and by extension TypeScript) does not have that - so back to a regular `for` cycle.
We're looping through both arrays, and if the digits are identical, we add them to the sum.
Note, that if a digit from the first half is identical to a digit from the second half, the reverse is true as well, we need to add the digit to the sum twice.

## [Day 02 - Corruption Checksum](http://adventofcode.com/2017/day/2)
This time we are given a spreadsheet (a matrix of numbers) and we need to find some kind of checksum.
Parsing the input is straightforward, we only need to take care that the values are tab-delimited.

### Part 1
We need to find the maximum and minimum of very row, subtract them, and sum up the differences.
This is very easy to do using the ES6 spread operator and the `Math.min` and `Math.max` functions.
We can even use `map` and `reduce` to turn this solution into a one-liner.

### Part 2
We need to find the only two numbers that evenly divide each other (We are promised that there is only one such pair per line).
My solution for every row is to simply sort the numbers (no need to try to divide a smaller number by a larger one).
Then we can then brute force all pairs looking for zero remainders.

## [Day 03 - Spiral Memory](http://adventofcode.com/2017/day/3)
This task involves generating numbers into a spiral matrix, according to some rule, with the number 1 in the center. A nice observation is that the side of the matrix is always an odd number, as the even-numbered matrices do not have a center.   
So, for every number of the type `2n+1`, the size of the matrix goes from `2n-1 * 2n-1` to `2n+1 * 2n+1` by adding 4 rows of `2n` number on the right, top, left and bottom side respectively. That gives us a convenient way to generate all the numbers.  
Moreover, the needed size of the matrix will be comparable with the square root of the index, specifically, if will be equal or less then the next odd number after the square root.

### Part 1
In this part the generated numbers are the integer sequence. The solution is not optimal, as the task of generating and processing the matrix are separated. First we generate a matrix that we know will include the target number, and next we scan the matrix (yes, it's `O(n^2)`) for the given number. Once we find it, we just need to add it's absolute distance to the center.

### Part 2
Now, we need to generate numbers according to the sum of a cell's neighbours. I got lucky on this part, since my generation algorithm is independent of the value generated. I just needed to add the calculation of the cell's value into the generation, and cutoff the generation once the value is reached.

## [Day 4 - High-Entropy Passphrases](http://adventofcode.com/2017/day/4)
This task gives us a list of "passphrases", and we need to filter out the valid ones, according to a rule

### Part 1
Here the rule is that the passphrases should not contain two duplicate words. The naive approach is to compare every word to every other word, and stop if a pair is equal. What I've done instead is to sort the input, and once sorted, I just need to check if any two consecutive indices have the same value. The solution is straightforward, since alphabetical sorting is default sorting behavour in javascript.

### Part 2
Here the rule is that any two words should not be anagrams of each other. Instead of comparing the values and frequencies of each letter, we can transform each word to a base alternative, by sorting the characters within. Once we sort all the characters in the words, we can sort the words, and the check is, again, whether two consecutive indices have the same value

## [Day 5 - A Maze of Twisty Trampolines, All Alike](http://adventofcode.com/2017/day/5)







