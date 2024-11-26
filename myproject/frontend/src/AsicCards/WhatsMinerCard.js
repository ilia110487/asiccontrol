import React, { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import DeviceMenu from "./DeviceMenu"; // Подключаем меню для устройств
import "./WhatsMinerCard.css";

const WhatsMinerCard = ({ device, onEditDevice, onDeleteDevice }) => {
    const [minerData, setMinerData] = useState(null);
    const [hashrateHistory, setHashrateHistory] = useState([]);
    const updateInterval = 30000; // Обновление каждые 30 секунд
    const [initialHashrate, setInitialHashrate] = useState(null);

    const fetchMinerData = async () => {
        try {
            console.log(`[DEBUG] [FETCH_MINER_DATA] Запрос данных устройства с ID: ${device.id}`);
            const response = await fetch(`http://127.0.0.1:8000/api/devices/${device.id}/fetch_data/`);
            console.log(`[DEBUG] [FETCH_MINER_DATA] Ответ от API:`, response);

            if (!response.ok) {
                throw new Error(`[FETCH_MINER_DATA] Ошибка загрузки данных устройства: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`[DEBUG] [FETCH_MINER_DATA] Данные устройства:`, data);

            const summary = data.SUMMARY?.[0] || {};
            if (!summary) {
                console.error("[ERROR] [FETCH_MINER_DATA] Поле SUMMARY отсутствует в данных:", data);
                return;
            }

            setMinerData({
                type: device.type,
                hashrate: parseFloat(summary["MHS av"]) / 1000 || 0, // Преобразуем MHS в GHS
                fanSpeedIn: summary["Fan Speed In"] || "N/A",
                fanSpeedOut: summary["Fan Speed Out"] || "N/A",
                temperature: summary["Temperature"] || "N/A",
                power: summary["Power"] || "N/A",
            });

            if (initialHashrate === null) {
                setInitialHashrate(parseFloat(summary["MHS av"]) / 1000 || 0);
            }
        } catch (err) {
            console.error("[ERROR] [FETCH_MINER_DATA] Ошибка загрузки данных устройства:", err);
        }
    };

    const fetchHashrateHistory = async () => {
        try {
            console.log(`[DEBUG] [FETCH_HASHRATE_HISTORY] Запрос истории хэшрейта для устройства с ID: ${device.id}`);
            const response = await fetch(`http://127.0.0.1:8000/api/devices/${device.id}/hashrate_history/`);
            console.log(`[DEBUG] [FETCH_HASHRATE_HISTORY] Ответ от API:`, response);

            if (!response.ok) {
                throw new Error(`[FETCH_HASHRATE_HISTORY] Ошибка загрузки истории хэшрейта: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`[DEBUG] [FETCH_HASHRATE_HISTORY] Данные истории хэшрейта:`, data);

            const formattedData = data.map((record) => ({
                hashrate: Math.max(record.hashrate / 1000, 0), // Преобразуем в GH/s
                timestamp: record.timestamp, // Добавляем для графика
            }));

            setHashrateHistory(formattedData);
        } catch (err) {
            console.error("[ERROR] [FETCH_HASHRATE_HISTORY] Ошибка загрузки истории хэшрейта:", err);
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

    if (!minerData || !hashrateHistory.length) {
        return <div className="whatsminer-card">Загрузка данных...</div>;
    }

    const isConnectionLost = !minerData.hashrate || minerData.hashrate === 0;
    const isHashrateDropped =
        initialHashrate &&
        minerData.hashrate < initialHashrate * 0.75;

    const statusColor = isConnectionLost || isHashrateDropped ? "red" : "green";

    return (
        <div className="whatsminer-card">
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
                    {minerData.hashrate?.toFixed(2) || "N/A"} GH/s
                </div>
                {/* Подключаем меню для редактирования/удаления */}
                <DeviceMenu
                    device={device}
                    onEditDevice={onEditDevice}
                    onDeleteDevice={onDeleteDevice}
                />
            </header>
            <div className="card-body">
                <div className="metrics-row">
                    <div className="temperature-section">
                        <span>Температура</span>
                        <div>{minerData.temperature}°C</div>
                    </div>
                    <div className="fan-speed-section">
                        <span>Скорость вентиляторов</span>
                        <div>In: {minerData.fanSpeedIn} RPM</div>
                        <div>Out: {minerData.fanSpeedOut} RPM</div>
                    </div>
                    <div className="power-section">
                        <span>Потребляемая мощность</span>
                        <div>{minerData.power} W</div>
                    </div>
                </div>
                <div className="hashrate-section">
                    <ResponsiveContainer width="100%" height={75}>
                        <AreaChart data={hashrateHistory}>
                            <defs>
                                <linearGradient id="colorHashrate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="orange" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="orange" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis hide={true} />
                            <YAxis hide={true} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="hashrate"
                                stroke="orange"
                                fill="url(#colorHashrate)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default WhatsMinerCard;
