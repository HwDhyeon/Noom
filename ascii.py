import random
import string


count = 10
pattern = string.digits + string.ascii_lowercase

result = ''.join([random.choice(pattern) for _ in range(count)])

print(result)
