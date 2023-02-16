from anatomic_site import AnatomyMap

map = AnatomyMap()

print(map.get_site_by_index(15))
print(map.get_parent_site(15))
print(map.get_children_sites(37))