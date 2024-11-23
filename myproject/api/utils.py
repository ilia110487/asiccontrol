import requests
from requests.auth import HTTPDigestAuth

def fetch_miner_data(url, username, password):
    """
    Функция для получения данных с ASIC-майнера с правильной авторизацией и заголовками.
    """
    try:
        # Логируем начало запроса
        print(f"Выполняем запрос к устройству: {url} с логином: {username}")

        # Указываем заголовки
        headers = {
            "Accept": "application/json,text/javascript,*/*;q=0.01",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 Edg/131.0.0.0",
            "X-Requested-With": "XMLHttpRequest",
        }

        # Проверяем и исправляем URL, если требуется
        if not url.endswith("/cgi-bin/stats.cgi"):
            if url.endswith("/"):
                url = f"{url}cgi-bin/stats.cgi"
            else:
                url = f"{url}/cgi-bin/stats.cgi"

        # Выполняем запрос
        response = requests.get(url, auth=HTTPDigestAuth(username, password), headers=headers, timeout=10)

        # Логируем статус ответа
        print(f"Ответ получен с кодом: {response.status_code}")

        # Проверяем статус ответа
        if response.status_code != 200:
            print(f"Ошибка: Статус страницы {response.status_code}")
            return {"error": f"Ошибка: Статус страницы {response.status_code}"}

        # Логируем тело ответа
        print(f"Тело ответа от устройства: {response.text}")

        # Проверяем, что ответ содержит JSON
        try:
            data = response.json()
        except ValueError:
            print("Ошибка парсинга JSON. Ответ устройства некорректен.")
            return {"error": "Устройство вернуло некорректный JSON"}

        print("Ответ успешно преобразован в JSON.")
        return data

    except requests.Timeout:
        print("Ошибка: Превышено время ожидания ответа от устройства.")
        return {"error": "Превышено время ожидания ответа от устройства"}
    except requests.ConnectionError:
        print("Ошибка: Не удалось подключиться к устройству.")
        return {"error": "Не удалось подключиться к устройству"}
    except requests.RequestException as e:
        print(f"Ошибка подключения: {str(e)}")
        return {"error": f"Ошибка подключения: {str(e)}"}
