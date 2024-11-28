from whatsminer import WhatsminerAccessToken, WhatsminerAPI
import re

def fetch_whatsminer_data(ip, command="summary", port=4028):
    """
    Получение данных от Whatsminer через библиотеку WhatsminerAPI.

    Args:
        ip (str): IP-адрес или доменное имя устройства. Если в строке есть префикс http:// или https://, он будет удален.
        command (str): Команда для выполнения (например, "summary").
        port (int): Порт для подключения (по умолчанию 4028).

    Returns:
        dict: Ответ устройства в формате JSON или ошибка.
    """
    try:
        # Убираем http:// или https:// из строки IP/домена
        sanitized_ip = re.sub(r'^https?://|http://', '', ip)
        
        # Логируем очищенный IP
        print(f"[DEBUG] Очищенный IP/домен: {sanitized_ip}")

        # Создаем токен доступа
        token = WhatsminerAccessToken(ip_address=sanitized_ip, port=port)

        # Выполняем команду
        response = WhatsminerAPI.get_read_only_info(access_token=token, cmd=command)

        # Логируем результат
        print(f"[DEBUG] Ответ от устройства {sanitized_ip}: {response}")

        # Возвращаем результат
        return response
    except Exception as e:
        # Логируем ошибки
        print(f"[ERROR] Ошибка при подключении к {ip}: {e}")
        return {"error": f"Ошибка при выполнении команды {command}: {str(e)}"}
