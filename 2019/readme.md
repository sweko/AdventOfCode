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
