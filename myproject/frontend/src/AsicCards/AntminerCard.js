import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import "./AntminerCard.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AntminerCard = ({ device }) => {
    const [minerData, setMinerData] = useState(null);
    const [hashrateHistory, setHashrateHistory] = useState(null);

    // Интервал обновления данных (в миллисекундах)
    const updateInterval = 30000; // Обновление каждые 30 секунд

    // Функция для получения данных устройства
    const fetchMinerData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/devices/${device.id}/fetch_data/`);
            const data = await response.json();

            if (data.STATS && data.STATS.length > 0) {
                const stats = data.STATS[0];
                setMinerData({
                    type: data.INFO.type,
                    hashrate_5s: stats.rate_5s,
                    fans: stats.fan || [],
                    chains: stats.chain || [],
                });
            } else {
                console.error("STATS отсутствует в данных устройства.");
            }
        } catch (err) {
            console.error("Ошибка загрузки данных устройства:", err);
        }
    };

    // Функция для получения истории хэшрейта
    const fetchHashrateHistory = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/devices/${device.id}/hashrate_history/`);
            const data = await response.json();

            // Форматирование данных для графика
            const labels = data.map((record) =>
                new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            );
            const values = data.map((record) => Math.max(record.hashrate, 0)); // Исключаем отрицательные значения

            setHashrateHistory({
                labels,
                datasets: [
                    {
                        label: "Hashrate (GH/s)",
                        data: values,
                        borderColor: "orange",
                        backgroundColor: "rgba(255, 165, 0, 0.2)",
                        tension: 0.4,
                    },
                ],
            });
        } catch (err) {
            console.error("Ошибка загрузки истории хэшрейта:", err);
        }
    };

    // Эффект для первичной загрузки данных и установки интервала обновления
    useEffect(() => {
        // Функция для обновления данных
        const updateData = () => {
            fetchMinerData();
            fetchHashrateHistory(); // Обновляем и историю хэшрейта
        };

        // Загрузка данных при первом рендере
        updateData();

        // Установка интервала
        const intervalId = setInterval(updateData, updateInterval);

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(intervalId);
    }, [device]);

    if (!minerData || !hashrateHistory) {
        return <div className="antminer-card">Загрузка данных...</div>;
    }

    // Вычисление самой высокой температуры для каждой платы
    const chainMaxTemps = minerData.chains.map((chain) => {
        const maxTemp = Math.max(...chain.temp_chip);
        return { chainIndex: chain.index, maxTemp };
    });

    return (
        <div className="antminer-card">
            <header className="card-header">
                <div className="card-title">
                    <h2>{minerData.type}</h2>
                    <div className="card-info">
                        <span className="device-ip">{device.ip}</span>
                    </div>
                </div>
                <div className="hashrate-display">
                    {minerData.hashrate_5s?.toFixed(2) || "N/A"} GH/s
                </div>
            </header>
            <div className="card-body">
                {/* Температуры плат */}
                <div className="metrics-row">
                    <div className="board-temps">
                        {chainMaxTemps.map((chain, index) => (
                            <div key={index} className="board-temp">
                                <span>Плата {chain.chainIndex}: </span>
                                <span>{chain.maxTemp || "N/A"}°C</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Вентиляторы */}
                <div className="fan-section">
                    {minerData.fans.map((fanSpeed, index) => (
                        <div key={index} className="fan-item">
                            <div className="fan-info">{fanSpeed} RPM</div>
                            <div
                                className="fan-bar"
                                style={{
                                    width: `${(fanSpeed / 7000) * 100}%`,
                                    backgroundColor:
                                        fanSpeed < 2000
                                            ? "green"
                                            : fanSpeed < 5000
                                            ? "orange"
                                            : "red",
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
                {/* График хэшрейта */}
                <div className="hashrate-section">
                    <Line
                        data={hashrateHistory}
                        options={{
                            responsive: true,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: {
                                    ticks: { display: true }, // Метки на оси X
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AntminerCard;
