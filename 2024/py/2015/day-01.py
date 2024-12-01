with open('day-01.txt') as f:
    data = f.read()

# Part 1

floor = 0
for c in data:
    if c == '(':
        floor += 1
    elif c == ')':
        floor -= 1

print(floor)

# Part 2

floor = 0
for i, c in enumerate(data):
    if c == '(':
        floor += 1
    elif c == ')':
        floor -= 1
    if floor == -1:
        print(i + 1)
        break


