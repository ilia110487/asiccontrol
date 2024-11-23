const data = {
    labels: Array.from({ length: 24 }, () => ""), // Пример меток (часы скрыты)
    values: [50, 60, 70, 90, 100, 110, 130, 150, 160, 170, 180, 200], // Пример значений (TH/s)
};

// Использование компонента:
<GradientHashrateChart data={data} />;
