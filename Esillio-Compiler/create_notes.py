import random

categories = []

with open("prompts/categories.txt") as f:
    for line in f:
        line = line.strip()
        if line:
            categories.append(line)

TOTAL_PER_CATEGORY = 20

with open("notes.txt", "w") as out:

    for category in categories:

        for _ in range(TOTAL_PER_CATEGORY):

            out.write(category + "\n")

print("Categories expanded:", len(categories) * TOTAL_PER_CATEGORY)
