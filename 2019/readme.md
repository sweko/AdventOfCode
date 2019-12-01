# Advent of code - 2018
So, now Santa is stuck on the edge of the Solar system and needs measurements from 50 stars to be able to navigate. Well, we know how to get stars, don't we?

(I will be solving the tasks using mostly TypeScript.)

## [Day 01 - The Tyranny of the Rocket Equation](http://adventofcode.com/2019/day/1)
Apparently we need to go to space as well, and we have a spaceship. And spaceships need fuel. Well, we have a list of modules with their respective weights, and we have a formula of how much fuel a specific weight needs.

<details>
    <summary><b>Part 1</b></summary>
    <p>
        
In the first part the task is to simply determine the fuel needed for all the modules. Since I already have a helper sum extension on the array, that's a simple one-liner. (Yes, I do know that there are languages whose standard library has a sum method. No need to remind me.)
    </p>
</details>

<details>
    <summary><b>Part 2</b></summary>
    <p>
       
In the second part we get to the reality that fuel has weight as well, so we need fuel to lift the fuel, and than we need fuel for the fuel that lifts the actual fuel and so on. Basically we need to implement a poor-man's integration for the fuel, by repeating the formula from part 1 over and over again. 
    </p>
</details>
