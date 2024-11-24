import hashlib
import json
import socket


def generate_whatsminer_token(ip, port=4028, admin_password=None):
    """
    Функция для генерации токена доступа к Whatsminer через команду get_token.

    :param ip: IP-адрес устройства.
    :param port: Порт устройства (по умолчанию 4028).
    :param admin_password: Пароль администратора (если требуется).
    :return: Словарь с токеном или ошибкой.
    """
    try:
        # Устанавливаем соединение с устройством
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(10)  # Тайм-аут для подключения
            s.connect((ip, port))

            # Отправляем команду для получения токена
            get_token_command = json.dumps({"cmd": "get_token"})
            s.sendall(get_token_command.encode("utf-8"))

            # Получаем ответ
            response = s.recv(4096)
            token_data = json.loads(response.decode("utf-8"))

            # Проверяем структуру ответа
            if not isinstance(token_data, dict) or "salt" not in token_data:
                return {"error": "Некорректный ответ от устройства. Отсутствует ключ 'salt'."}

            # Если передан admin_password, генерируем токен
            if admin_password:
                try:
                    token = hashlib.sha256((admin_password + token_data["salt"]).encode("utf-8")).hexdigest()
                    return {"token": token}
                except Exception as hash_err:
                    return {"error": f"Ошибка генерации токена: {str(hash_err)}"}

            # Возвращаем полный ответ, если admin_password не передан
            return token_data

    except socket.timeout:
        return {"error": f"Подключение к {ip}:{port} не удалось. Тайм-аут подключения."}
    except socket.error as sock_err:
        return {"error": f"Ошибка сокета: {str(sock_err)}"}
    except json.JSONDecodeError:
        return {"error": "Ошибка парсинга ответа устройства. Некорректный JSON."}
    except Exception as e:
        return {"error": f"Неизвестная ошибка: {str(e)}"}
