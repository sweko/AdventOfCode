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

## [Day 04 - Repose Record](http://adventofcode.com/2018/day/4)

Somehow, we're in a supply closet, and we have some sort of records all over the walls. The records (our input) are unsorted, and concern the times of when and which guard is sleeping on the job. Each record has a timestamp as well as an action, e.g. `[1518-09-21 00:04] Guard #2381 begins shift` - yes, the 1518 is the year, we're time traveling remember?  
The major issue with this task is the input processing code. First, I used a regex to get the timestamps processed, but I kept a `MMDDHHmm` string in the resulting objects as well, to be able to sort the input on that. Once we get a linear sequence of events, the logic is mostly straigh-forward. We can use the guard change event to extract the ID of current guards, all since the sleep/wakeup events occur in pairs we can get a start/end data for the sleeping. Using that I've build a dictionary with guard data that included a summary of the sleep times. Also I've added a total of the time slept.

<details>
    <summary><b>Part 1</b></summary>
    <p>
The task for part 1 is find which guard sleeps the most, and in what minute. Once the input was parsed and processed, this is a oneliner - sort the guards by time slept, and get the data.
    </p>
</details>

<details>
    <summary><b>Part 2</b></summary>
    <p>
The task for part 2 is a bit inverse of the first one as we need to find which guard sleeps most often in the same minute. I got lucky because I already had all the data required, so this was again a one-liner.
Note that instead of sorting and getting the first value, it's possible to simply reduce the guards array to the maximum, but the runtime complexity as well as code clarity are relatively similar for the provided data.
    </p>
</details>

## [Day 05 - Alchemical Reduction](http://adventofcode.com/2018/day/5)

The elves are making Santa's magic suite, and we need to help then reduce some polymers. We are given a string of 50K characters, and we need to remove all pairs of same small and capital characters that are next to one another, recursively (i.e. Aa, bB, cDdC)

<details>
    <summary><b>Part 1</b></summary>
    <p>
The task for part 1 is to count how many characters will be left in the input once we finish the removal process. The naive approach here is to walk the source, and when we find a matching pair, remove them. Repeat the process until no match is found. To start in that direction, I converted the input into a character array, that I converted into an array of character codes (in ASCII, the difference between a lowercase and uppercase letter is always 32, so it's easier to check).  

However, removal of characters from a string is a copy operation, and if we do several thousand of that to a 50k element array, it will take some time, as well use lots and lots of memory. The way I worked around that is to keep the original array, and just set to `0` the elements that are "removed". When we get to a `0` as the next element, we just walk the array until we get to a non-zero element.

Next problem is that that we will have several hundred runs of the array, which turns into lots of millions of array index access. Since arrays in JavaScript are just number-based dictionaries, this can have widely detrimental performance effects. Fortunately we do have the `Int8Array`, which is guaranteed to be an actual array in memory, so changing the array to `Int8Array` took care of that.
    </p>
</details>

<details>
    <summary><b>Part 2</b></summary>
    <p>
Part 2 is a simple extension of part 1 - we again need to process the input, only we need to do it 26 times, ignoring a letter each time. I did the ignoring part using a simple filter operation which is a bit slow on `Int8Array`, but the result was menageable, as it did the whole loop in under a minute.
    </p>
</details>

<details>
    <summary><b>Optimization</b></summary>
    <p>
The task was solved, but still there is too much work being done over and over againg. The time complexity of the algorithm used is at least quadratic, so next thing I did (after a discussion with some coleagues) was to try to do a single pass removal. One way to do it is to use a stack where we push the items, and the removal will be a simple "pop the top if the next item matches the top". In this approach it can be very usefull that JavaScript arrays can behave like a stack or a queue if needed. Another approach is to use a couple of pointers for the characters that are matched, one for the first character, and one for the second, keeping the zeroing of "removed" items. When we actually do a remove, we need to move the first pointer back until we get to a non-zero character. Another optimization is that I used a running tally of the result length, so no post-processing was needed to get the result. Using the second approach, the task took less than a second to run both parts.  
In the code, the original approach is `reactPolymer` and the optimization is `reactPolymerSinglePass`.
    </p>
</details>