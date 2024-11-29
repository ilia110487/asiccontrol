import requests

def fetch_innosilicon_data(ip, username, password):
    """
    Получает данные с устройства Innosilicon по указанному IP.
    """
    try:
        # Используем переданный токен (не генерируем его, так как он задан вручную)
        token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBc2ljTWluZXIiLCJpYXQiOjE3MzI4ODIxOTMsImV4cCI6MTczMjkwMzc5MywidXNlciI6ImFkbWluIn0.QW2bbxOuWt3XG2JbOcM9kfKc6iGS8bF7DQJaT7K-diI"

        # Заголовки с токеном авторизации
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json;charset=UTF-8",
        }

        # URL-адрес для получения данных
        url = f"{ip}/api/summary"

        # Отправляем POST-запрос
        response = requests.post(url, headers=headers, json={})

        # Проверяем код состояния
        if response.status_code != 200:
            return {"error": f"Ошибка {response.status_code}: {response.text}"}

        # Получаем JSON-данные
        data = response.json()

        # Проверяем успешность операции
        if not data.get("success", False):
            return {"error": "Устройство не вернуло данные, success = False"}

        # Извлекаем ключевые метрики
        devs = data.get("DEVS", [{}])
        hardware = data.get("HARDWARE", {})
        total_hash = data.get("TotalHash", {})

        metrics = {
            "hashrate": total_hash.get("Hash Rate", 0),
            "unit": total_hash.get("Unit", "TH/s"),
            "temperature": devs[0].get("Temperature", 0) if devs else 0,
            "fan_duty": hardware.get("Fan duty", 0),
            "status": devs[0].get("Status", "Unknown") if devs else "Unknown",
        }

        return {"metrics": metrics, "raw_data": data}

    except requests.exceptions.RequestException as e:
        return {"error": f"Сетевая ошибка: {str(e)}"}
    except Exception as e:
        return {"error": f"Ошибка при выполнении запроса: {str(e)}"}
