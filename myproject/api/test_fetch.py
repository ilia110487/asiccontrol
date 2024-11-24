from .fetch_whatsminer_data import fetch_whatsminer_data  # Для Whatsminer


data = fetch_whatsminer_data("watsminer58.r-family.keenetic.pro", "admin", "password")
print(data)
