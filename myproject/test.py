from whatsminer import WhatsminerAccessToken, WhatsminerAPI

try:
    # Создание токена для доступа к устройству
    token = WhatsminerAccessToken(ip_address="192.168.1.44")
    
    # Получение информации о устройстве
    summary_json = WhatsminerAPI.get_read_only_info(access_token=token, cmd="summary")
    
    # Вывод результата в консоль
    print("Summary JSON:")
    print(summary_json)

except Exception as e:
    print(f"Ошибка: {e}")
