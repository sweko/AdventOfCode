# Advent of code - 2018
So, the story this year involves time-travel to different periods of time. Someone (I have a strong hunch it will turn out to be the Easter Bunny) is travelling back in time and changing Santa's history. So we need to go as well and fix everything before it's too late!

I will be solving the tasks using TypeScript.

## [Day 01 - Chronal Calibration](http://adventofcode.com/2018/day/1)
So, before we start travelling we need to calibrate our wrist-mounted device using a sequence of changes in frequency. The input is a list of those changes (positive or negative).

<details>
    <summary><b>Part 1</b></summary>
    <p>
        In the first part the task is to simply add up the changes. Since I already have a helper sum extension on the array, that's a simple one-liner. (Yes, I do know that there are languages whose standard library has a sum method. No need to remind me.)
    </p>
</details>

<details>
    <summary><b>Part 2</b></summary>
    <p>
In the second part we get to treat the input as a circular buffer, restarting from the end when it finishes. We need to find the first running total that appears twice. I used a `while(true)` loop *(don't try this at home)* that looped the array, while maintaining a dictionary of previous running totals. Once we encounted a value we already have, we break the infinite loop, and that's it.
    </p>
</details>

## [Day 02 - Inventory Management System](http://adventofcode.com/2018/day/2)

Ok, we're in year 1518, and the elves have misplaced the prototype for Santa's suit. We have a list of scanned inventory boxes IDs (and Santa apparently had those in the Middle ages) and that's our input.

<details>
    <summary><b>Part 1</b></summary>
    <p>
For part 1 we need to generate some sort of a checksum of the input. We need to find the IDs that have two or three identical letters. Fortunately, strings are basically arrays, and I have a `groupReduce` helper that will groups the characters by letter, and then reduce them to their length. So, two calls to the function later, we have the number of twos and threes respecively, we multiply them per instruction, and we're done.
    </p>
</details>

<details>
    <summary><b>Part 2</b></summary>
    <p>
For this part we need to find the two boxes from the input whose IDs differ only by one letter. Not to put a too fine line on it, three nested `for`s later (one for the first string, one for the second, and one for the character-by-character comparisson), we've gotten the answer. As the input guaranteed that there will only be one solution, we can just `return` from the call as soon as we get the result.
    </p>
</details>

## [Day 03 - No Matter How You Slice It](http://adventofcode.com/2018/day/3)

Well, we have the fabric now, so time to start cutting. This is the first task this year with a complicated input (the format is `#697 @ 348,444: 19x22`) but a quick regex took care of that, and we had the input in a warm and cosy array of objects. The objects actually represent rectangle coordinates on a 1000x1000 grid, called claims.

<details>
    <summary><b>Part 1</b></summary>
    <p>
The task for part 1 is to count how many grid cells are overlapped with two or more claims. The solution? Just create the grid, initialized with `0`, and process each claim, adding `1` to each cell in it. After that, we just count up the cells that have a value of two or more (using the helper sum extension)
    </p>
</details>

<details>
    <summary><b>Part 2</b></summary>
    <p>
And now we are promised that only one of the claims does not overlap with any other, and we are tasked to find it. I've added an `isOverlapping` field to the claim, that is initally set to false, and initialized the grid with `0`. This time around, though, instead of adding, each cell is set to the 1-based index of the claim. If the cell is already claimed, then both the claimant and the current claim are marked as overlapping. Repeat until we run out of claims, and find the first (and only) one that is not overlapping.
    </p>
</details>
