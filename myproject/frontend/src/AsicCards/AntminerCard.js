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
import "./AntminerCard.css";

const AntminerCard = ({ device }) => {
    const [minerData, setMinerData] = useState(null);
    const [hashrateHistory, setHashrateHistory] = useState([]);
    const updateInterval = 30000; // Обновление каждые 30 секунд
    const [initialHashrate, setInitialHashrate] = useState(null);

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
                    setInitialHashrate(stats.rate_5s);
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

            const formattedData = data.map((record) => ({
                hashrate: Math.max(record.hashrate / 1000, 0), // Преобразуем в TH/s
            }));

            setHashrateHistory(formattedData);
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

    if (!minerData || !hashrateHistory.length) {
        return <div className="antminer-card">Загрузка данных...</div>;
    }

    const chainMaxTemps = minerData.chains.map((chain) => {
        const maxTemp = Math.max(...chain.temp_chip);
        return { chainIndex: chain.index, maxTemp };
    });

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
                    {minerData.hashrate_5s?.toFixed(2) || "N/A"} TH/s
                </div>
            </header>
            <div className="card-body">
                {/* Платы и вентиляторы */}
                <div className="metrics-row">
                    {/* Платы */}
                    <div className="board-temps">
                        <span style={{ fontSize: "0.8rem", marginBottom: "5px" }}>Платы</span>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {chainMaxTemps.map((chain, index) => {
                                const tempColor =
                                    chain.maxTemp < 50
                                        ? "green"
                                        : chain.maxTemp < 70
                                        ? "orange"
                                        : "red";
                                return (
                                    <div
                                        key={index}
                                        className="board-temp"
                                        style={{
                                            backgroundColor: tempColor,
                                            color: "white",
                                            borderRadius: "50%",
                                            width: "35px",
                                            height: "35px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {chain.maxTemp}°C
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Вентиляторы */}
                    <div className="fan-grid">
                        <span style={{ fontSize: "0.8rem", marginBottom: "5px" }}>
                            (Вентиляторы / RPM)
                        </span>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {minerData.fans.map((fanSpeed, index) => (
                                <div
                                    key={index}
                                    className="fan-item"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "0.9rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {fanSpeed}
                                    </span>
                                    <div
                                        className="fan-bar"
                                        style={{
                                            width: "50px",
                                            height: "5px",
                                            backgroundColor:
                                                fanSpeed < 2000
                                                    ? "green"
                                                    : fanSpeed < 5000
                                                    ? "orange"
                                                    : "red",
                                            marginTop: "5px",
                                        }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* График */}
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

export default AntminerCard;
