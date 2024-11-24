from whatsminer import WhatsminerAccessToken, WhatsminerAPI


def create_whatsminer_token(ip, admin_password, port=4028):
    """
    Создает токен доступа для устройства Whatsminer.
    """
    try:
        # Создаем токен для устройства
        token = WhatsminerAccessToken(ip_address=ip, admin_password=admin_password, port=port)
        print(f"Токен для устройства {ip} успешно создан.")
        return token
    except Exception as e:
        print(f"Ошибка при создании токена: {str(e)}")
        return None


def fetch_whatsminer_summary(ip, admin_password):
    """
    Получает данные `summary` с устройства Whatsminer с использованием токена.
    """
    try:
        # Создаем токен
        token = create_whatsminer_token(ip, admin_password)

        if not token:
            return {"error": "Не удалось создать токен доступа."}

        # Запрашиваем данные через API
        summary_data = WhatsminerAPI.get_read_only_info(token, cmd="summary")
        print(f"Полученные данные: {summary_data}")
        return summary_data
    except Exception as e:
        print(f"Ошибка при получении данных: {str(e)}")
        return {"error": f"Ошибка при получении данных: {str(e)}"}
