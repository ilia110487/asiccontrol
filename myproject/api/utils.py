import requests
from requests.auth import HTTPDigestAuth

def fetch_miner_data(url, username, password):
    """
    Функция для получения данных с ASIC-майнера.
    """
    try:
        # Отправляем запрос к API
        response = requests.get(url, auth=HTTPDigestAuth(username, password), timeout=10)

        # Проверяем статус ответа
        if response.status_code != 200:
            return {"error": f"Ошибка: Статус страницы {response.status_code}"}

        # Парсим JSON-ответ
        data = response.json()

        # Извлекаем информацию о статусе
        miner_info = data.get("INFO", {})
        miner_version = miner_info.get("miner_version", "N/A")
        compile_time = miner_info.get("CompileTime", "N/A")
        miner_type = miner_info.get("type", "N/A")

        # Основные статистики
        stats = data.get("STATS", [{}])[0]
        elapsed_time = stats.get("elapsed", "N/A")
        hashrate_5s = stats.get("rate_5s", "N/A")
        hashrate_30m = stats.get("rate_30m", "N/A")
        hashrate_avg = stats.get("rate_avg", "N/A")
        fan_speeds = stats.get("fan", [])

        # Информация о вентиляторе
        fans = {
            f"fan{i+1}": fan_speeds[i] if i < len(fan_speeds) else "N/A"
            for i in range(4)
        }

        # Информация о цепях
        chains = stats.get("chain", [])
        chain_data = [
            {
                "index": chain.get("index", "N/A"),
                "freq_avg": chain.get("freq_avg", "N/A"),
                "rate_ideal": chain.get("rate_ideal", "N/A"),
                "rate_real": chain.get("rate_real", "N/A"),
                "temp_pic": chain.get("temp_pic", []),
                "temp_pcb": chain.get("temp_pcb", []),
                "temp_chip": chain.get("temp_chip", []),
                "hw": chain.get("hw", "N/A"),
                "serial_number": chain.get("sn", "N/A"),
            }
            for chain in chains
        ]

        # Возвращаем данные
        return {
            "miner_version": miner_version,
            "compile_time": compile_time,
            "miner_type": miner_type,
            "elapsed_time": elapsed_time,
            "hashrate_5s": f"{hashrate_5s} GH/s",
            "hashrate_30m": f"{hashrate_30m} GH/s",
            "hashrate_avg": f"{hashrate_avg} GH/s",
            "fan_speeds": fans,
            "chains": chain_data,
        }

    except requests.RequestException as e:
        return {"error": f"Ошибка подключения: {str(e)}"}
