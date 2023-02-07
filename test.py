# icd-11 api access variables
from anatomic_site import AnatomyMap
import numpy as np
import matplotlib.pyplot as plt

map = AnatomyMap()

# print("At level 1:" + str(len(map.get_sites_at_level(1))))
# print("At level 2:" + str(len(map.get_sites_at_level(2))))
# print("At level 3:" + str(len(map.get_sites_at_level(3))))
# print("At level 4:" + str(len(map.get_sites_at_level(4))))
# print("At level 5:" + str(len(map.get_sites_at_level(5))))
# print("At level 6:" + str(len(map.get_sites_at_level(6))))
# print("At level 7:" + str(len(map.get_sites_at_level(7))))
# print("At level 8:" + str(len(map.get_sites_at_level(8))))
# print("At level 9:" + str(len(map.get_sites_at_level(9))))

# def count_sites_at_level(level):
#     return len(map.get_sites_at_level(level))

# levels = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9])
# count = []

# for level in levels:
#     count.append(count_sites_at_level(level))

# plt.bar(levels, count)
# plt.xlabel("Levels")
# plt.ylabel("Number of terms at level")
# plt.title("Distribution of ICD-ST terms for different hierarchical levels")
# plt.show()
print(map.get_sites_at_level(1), '\n')
print(map.get_sites_at_level(3), '\n')
print(map.get_sites_at_level(5), '\n')
print(map.get_sites_at_level(6), '\n')