use std::fs::File;
use std::io::prelude::*;

pub fn day01() {
    let mut file = File::open(".\\src\\2015\\day-01.txt").expect("file not found");
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .expect("something went wrong reading the file");

    // Part 1

    let mut floor = 0;
    for c in contents.chars() {
        match c {
            '(' => floor += 1,
            ')' => floor -= 1,
            _ => (),
        }
    }

    println!("Part 1: {}", floor);

    // Part 2

    let mut floor = 0;
    let mut position = 0;
    for c in contents.chars() {
        position += 1;
        match c {
            '(' => floor += 1,
            ')' => floor -= 1,
            _ => (),
        }
        if floor == -1 {
            break;
        }
    }

    println!("Part 2: {}", position);
}