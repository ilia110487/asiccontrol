import React, { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFan, faMicrochip, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import DeviceMenu from "./DeviceMenu";
import "./WhatsMinerCard.css";

const WhatsMinerCard = ({ device, onEditDevice, onDeleteDevice }) => {
    const [minerData, setMinerData] = useState(null);
    const [hashrateHistory, setHashrateHistory] = useState([]);
    const updateInterval = 30000;

    useEffect(() => {
        const fetchMinerData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/devices/${device.id}/fetch_data/`
                );
                const data = await response.json();

                if (data && data.SUMMARY && data.SUMMARY.length > 0) {
                    const summary = data.SUMMARY[0];
                    setMinerData({
                        type: device.type || "Unknown Device", // Используем поле type из API
                        hashrate: summary["MHS av"] / 1000 || 0, // Преобразуем MHS в GHS
                        fans: [summary["Fan Speed In"] || 0, summary["Fan Speed Out"] || 0],
                        temperature: summary["Temperature"] || 0,
                    });
                } else {
                    console.error("Ошибка: данные SUMMARY отсутствуют или пустые", data);
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        const fetchHashrateHistory = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/devices/${device.id}/hashrate_history/`
                );
                const data = await response.json();
                setHashrateHistory(
                    data.map((record) => ({
                        hashrate: Math.max(record.hashrate / 1000, 0),
                    }))
                );
            } catch (error) {
                console.error("Ошибка загрузки истории хэшрейта:", error);
            }
        };

        fetchMinerData();
        fetchHashrateHistory();

        const interval = setInterval(() => {
            fetchMinerData();
            fetchHashrateHistory();
        }, updateInterval);

        return () => clearInterval(interval);
    }, [device]);

    if (!minerData) return <div className="whatsminer-card">Загрузка...</div>;

    const getBarColor = (value, type) => {
        if (type === "fan") {
            if (value < 3000) return "green";
            if (value < 5000) return "orange";
            return "red";
        } else if (type === "temp") {
            if (value < 70) return "green";
            if (value < 85) return "orange";
            return "red";
        }
    };

    return (
        <div className="whatsminer-card">
            <div className="card-header">
                <div>
                    <span className="device-type">{minerData.type}</span> {/* Название устройства из device.type */}
                    <span className="device-ip">{device.ip}</span>
                </div>
                <div className="hashrate-section">
                    <span className="hashrate">{minerData.hashrate.toFixed(2)} GH/s</span>
                    <DeviceMenu
                        onEdit={() => onEditDevice(device)}
                        onDelete={() => onDeleteDevice(device.id)}
                    />
                </div>
            </div>
            <div className="card-body">
                <div className="metrics">
                    <div className="fans-section">
                        <div className="section-header">
                            <FontAwesomeIcon icon={faFan} className="section-icon" />
                            Вентиляторы (RPM)
                        </div>
                        <div className="fan-bars">
                            {minerData.fans.map((fan, index) => (
                                <div key={index} className="fan-item">
                                    <div
                                        className="fan-bar"
                                        style={{
                                            width: `${fan / 100}%`,
                                            backgroundColor: getBarColor(fan, "fan"),
                                        }}
                                    ></div>
                                    <span className="fan-value">
                                        {fan}
                                        {fan > 5000 && (
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="temperature-section">
                        <div className="section-header">
                            <FontAwesomeIcon icon={faMicrochip} className="section-icon" />
                            Плата
                        </div>
                        <div className="temperature-bar">
                            <div
                                className="temp-bar"
                                style={{
                                    width: `${Math.min((minerData.temperature / 100) * 100, 100)}%`,
                                    backgroundColor: getBarColor(minerData.temperature, "temp"),
                                    height: "10px",
                                    borderRadius: "5px",
                                    marginBottom: "5px",
                                }}
                            ></div>
                            <span className="temp-value">
                                {minerData.temperature}°C
                                {minerData.temperature > 85 && (
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="chart">
                    <ResponsiveContainer width="100%" height={50}>
                        <AreaChart data={hashrateHistory}>
                            <defs>
                                <linearGradient id="colorHashrate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="orange" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="orange" stopOpacity={0} />
                                </linearGradient>
                            </defs>
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
