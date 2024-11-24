import socket
import json


def is_host_reachable(ip, port=4028):
    """
    Проверяет, доступен ли хост через указанный порт.
    """
    try:
        with socket.create_connection((ip, port), timeout=5):
            print(f"Хост {ip}:{port} доступен.")
            return True
    except (socket.timeout, socket.error) as e:
        print(f"Хост {ip}:{port} недоступен. Ошибка: {e}")
        return False


def fetch_whatsminer_data(ip, command="summary", port=4028):
    """
    Функция для подключения к Whatsminer через API и выполнения команды.

    Args:
        ip (str): IP-адрес устройства.
        command (str): Команда для выполнения (например, "summary").
        port (int): Порт для подключения (по умолчанию 4028).

    Returns:
        dict: Ответ устройства в формате JSON.
    """
    try:
        # Проверяем доступность хоста
        if not is_host_reachable(ip, port):
            return {"error": f"Хост {ip} недоступен или порт {port} закрыт."}

        # Формируем команду
        json_command = json.dumps({"cmd": command})

        # Подключаемся через сокет и отправляем команду
        with socket.create_connection((ip, port), timeout=10) as sock:
            print(f"Подключение к {ip}:{port} установлено.")
            sock.sendall(json_command.encode('utf-8'))

            # Читаем ответ от устройства
            response = sock.recv(4096)
            print(f"Получен ответ: {response.decode('utf-8')}")

        # Парсим JSON-ответ
        data = json.loads(response.decode('utf-8'))
        return data

    except json.JSONDecodeError:
        print("Ошибка: Невозможно разобрать JSON-ответ.")
        return {"error": "Невозможно разобрать JSON-ответ."}

    except socket.error as e:
        print(f"Ошибка подключения через сокет: {e}")
        return {"error": f"Ошибка подключения через сокет: {e}"}


# Пример использования
if __name__ == "__main__":
    ip_address = "192.168.1.44"  # Укажите IP устройства
    command = "summary"  # Команда для выполнения
    response = fetch_whatsminer_data(ip=ip_address, command=command)
    print("Результат выполнения:")
    print(json.dumps(response, indent=4))
