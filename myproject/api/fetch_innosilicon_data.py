def fetch_innosilicon_data(ip, username, password):
    """
    Получение данных с устройства Innosilicon.
    """
    try:
        # Получение сессии (вместо токена)
        session = get_new_token(ip, username, password)
        if not session:
            return {"error": "Не удалось получить новый токен"}

        # URL для запроса данных
        url = f"{ip}/api/summary"

        # Заголовки для запроса
        headers = {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        }

        # Отправляем запрос
        response = session.get(url, headers=headers, timeout=10)
        data = response.json()

        # Извлечение метрик
        hashrate = data.get("TotalHash", {}).get("Hash Rate", 0)
        unit = data.get("TotalHash", {}).get("Unit", "TH/s")
        temperature = data.get("DEVS", [{}])[0].get("Temperature", 0)
        fan_duty = data.get("HARDWARE", {}).get("Fan duty", 0)
        status = data.get("DEVS", [{}])[0].get("Status", "Unknown")

        # Дополнительные метрики
        accepted_shares = data.get("DEVS", [{}])[0].get("Accepted", 0)
        rejected_shares = data.get("DEVS", [{}])[0].get("Rejected", 0)
        hardware_errors = data.get("DEVS", [{}])[0].get("Hardware Errors", 0)

        # Вывод данных для отладки
        print("Полный ответ сервера:", data)
        print(f"Хэшрейт: {hashrate} {unit}")
        print(f"Температура: {temperature}°C")
        print(f"Скорость вентилятора: {fan_duty}%")
        print(f"Статус устройства: {status}")
        print(f"Принятые шары: {accepted_shares}")
        print(f"Отклонённые шары: {rejected_shares}")
        print(f"Ошибки оборудования: {hardware_errors}")

        # Формируем результат
        return {
            "hashrate": hashrate,
            "unit": unit,
            "temperature": temperature,
            "fan_duty": fan_duty,
            "status": status,
            "accepted_shares": accepted_shares,
            "rejected_shares": rejected_shares,
            "hardware_errors": hardware_errors,
            "raw_data": data,
        }

    except requests.exceptions.RequestException as e:
        print(f"Сетевая ошибка: {e}")
        return {"error": f"Сетевая ошибка: {str(e)}"}
    except Exception as e:
        print(f"Ошибка при выполнении запроса: {e}")
        return {"error": f"Ошибка при выполнении запроса: {str(e)}"}
