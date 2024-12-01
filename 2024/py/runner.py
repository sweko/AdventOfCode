from importlib import import_module
import sys

day = sys.argv[1]

dayString = day.zfill(2)

module = import_module(f'day-{dayString}.code')

print(f'Running day {day}...')
print('Part one:')
module.part_one()

print('Part two:')
module.part_two()