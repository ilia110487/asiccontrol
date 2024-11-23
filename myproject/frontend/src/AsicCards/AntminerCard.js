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

    const updateInterval = 30000; // Обновление каждые 30 секунд
    const [initialHashrate, setInitialHashrate] = useState(null); // Для отслеживания падения хэшрейта

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

                if (initialHashrate === null) {
                    setInitialHashrate(stats.rate_5s); // Сохраняем стартовый хэшрейт
                }
            } else {
                console.error("STATS отсутствует в данных устройства.");
            }
        } catch (err) {
            console.error("Ошибка загрузки данных устройства:", err);
        }
    };

    const fetchHashrateHistory = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/devices/${device.id}/hashrate_history/`);
            const data = await response.json();

            const labels = Array.from({ length: data.length }, () => "");
            const values = data.map((record) => Math.max(record.hashrate / 1000, 0)); // Перевод в TH/s

            setHashrateHistory({
                labels,
                datasets: [
                    {
                        label: "",
                        data: values,
                        borderColor: "orange",
                        backgroundColor: "rgba(255, 165, 0, 0.1)",
                        tension: 0.4,
                        borderWidth: 1,
                        pointRadius: 1.5,
                    },
                ],
            });
        } catch (err) {
            console.error("Ошибка загрузки истории хэшрейта:", err);
        }
    };

    useEffect(() => {
        const updateData = () => {
            fetchMinerData();
            fetchHashrateHistory();
        };

        updateData();
        const intervalId = setInterval(updateData, updateInterval);

        return () => clearInterval(intervalId);
    }, [device]);

    if (!minerData || !hashrateHistory) {
        return <div className="antminer-card">Загрузка данных...</div>;
    }

    const chainMaxTemps = minerData.chains.map((chain) => {
        const maxTemp = Math.max(...chain.temp_chip);
        return { chainIndex: chain.index, maxTemp };
    });

    // Проверяем состояние устройства
    const isConnectionLost = !minerData.hashrate_5s || minerData.hashrate_5s === 0;
    const isHashrateDropped =
        initialHashrate &&
        minerData.hashrate_5s < initialHashrate * 0.75;

    const statusColor = isConnectionLost || isHashrateDropped ? "red" : "green";

    return (
        <div className="antminer-card">
            <header className="card-header">
                <div className="card-title">
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: statusColor,
                                borderRadius: "50%",
                            }}
                        ></div>
                        <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{minerData.type}</h3>
                    </div>
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
                <div className="fan-grid">
                    {minerData.fans.map((fanSpeed, index) => (
                        <div key={index} className="fan-item">
                            <div className="fan-info">
                                <span>
                                    <strong>FAN {index + 1}</strong> {fanSpeed} RPM
                                </span>
                                <div
                                    className={`fan-bar ${
                                        fanSpeed < 2000
                                            ? "green"
                                            : fanSpeed < 5000
                                            ? "orange"
                                            : "red"
                                    }`}
                                    style={{ width: `${(fanSpeed / 7000) * 100}%` }}
                                ></div>
                            </div>
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
                                x: { ticks: { display: false } },
                                y: {
                                    ticks: {
                                        callback: (value) => `${value.toFixed(1)} TH/s`,
                                    },
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
