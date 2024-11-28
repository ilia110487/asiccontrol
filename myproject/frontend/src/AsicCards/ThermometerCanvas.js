const createThermometer = (canvasId, temperature) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`[ERROR] Canvas with ID "${canvasId}" не найден.`);
        return;
    }

    const ctx = canvas.getContext("2d");

    const drawThermometer = (temp) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Фон
        ctx.fillStyle = "#f9f9f9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Цвет в зависимости от температуры
        let tempColor = "#00ff00"; // Зелёный
        if (temp > 60) tempColor = "#ff9900"; // Оранжевый
        if (temp > 80) tempColor = "#ff0000"; // Красный

        // Границы термометра
        ctx.fillStyle = "#ccc";
        ctx.fillRect(100, 50, 50, 300);

        // Внутренний фон термометра
        ctx.fillStyle = "#fff";
        ctx.fillRect(105, 55, 40, 290);

        // Уровень температуры
        const levelHeight = Math.min(temp * 2.9, 290); // Преобразуем температуру в высоту
        ctx.fillStyle = tempColor;
        ctx.fillRect(105, 345 - levelHeight, 40, levelHeight);

        // Отображение температуры
        ctx.font = "30px Arial";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(`${temp}°C`, 60, 200); // Крупный текст слева
    };

    drawThermometer(temperature);

    return {
        update: (newTemp) => {
            console.log(`[DEBUG] Обновление температуры до: ${newTemp}`);
            drawThermometer(newTemp);
        },
    };
};

// Экспорт функции для использования в других файлах
export default createThermometer;
