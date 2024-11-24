import socket
import json

def fetch_whatsminer_data(ip, port=4028, command="summary"):
    """
    Функция для отправки команд к Whatsminer через сокет.

    :param ip: IP-адрес устройства.
    :param port: Порт (по умолчанию 4028).
    :param command: Команда для выполнения (например, "summary").
    :return: Данные устройства в формате JSON или ошибка.
    """
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(10)  # Устанавливаем тайм-аут
            s.connect((ip, port))  # Подключаемся к устройству
            # Отправляем команду
            s.sendall(json.dumps({"cmd": command}).encode("utf-8"))
            data = s.recv(4096)  # Получаем ответ
            return json.loads(data.decode("utf-8"))  # Парсим JSON
    except socket.timeout:
        return {"error": "Превышен тайм-аут подключения к устройству."}
    except Exception as e:
        return {"error": str(e)}
