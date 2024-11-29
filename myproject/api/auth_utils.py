import requests

def get_new_token(ip, username, password):
    try:
        url = f"{ip}/api/auth/login"
        payload = {
            "username": username,
            "password": password,
        }
        headers = {"Content-Type": "application/json"}

        response = requests.post(url, json=payload, headers=headers)
        print(f"Код состояния: {response.status_code}")
        print(f"Ответ: {response.text}")

        if response.status_code != 200:
            return None

        data = response.json()
        return data.get("token")
    except requests.exceptions.RequestException as e:
        print(f"Ошибка сети: {e}")
        return None

# Пример использования
ip = "https://inno.r-family.keenetic.pro"
username = "admin"
password = "password"
token = get_new_token(ip, username, password)
print(f"Полученный токен: {token}")
