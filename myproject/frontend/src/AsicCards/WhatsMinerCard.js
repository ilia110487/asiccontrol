import React, { useState, useEffect } from "react";
import "./WhatsMinerCard.css";

const WhatsMinerCard = ({ device }) => {
    const [minerData, setMinerData] = useState(null);

    const fetchMinerData = async () => {
        try {
            const response = await fetch(`http://${device.ip}/cgi-bin/luci/admin/status/cgminerstatus`);
            const html = await response.text();
            
            // Парсинг HTML-страницы
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            
            // Извлечение данных (пример для GHSav, FanSpeedIn, FanSpeedOut и других параметров)
            const ghsAv = doc.querySelector("#cbi-table-1-mhsav").textContent.trim();
            const fanSpeedIn = doc.querySelector("#cbi-table-1-fanspeedin").textContent.trim();
            const fanSpeedOut = doc.querySelector("#cbi-table-1-fanspeedout").textContent.trim();

            setMinerData({
                ghsAv,
                fanSpeedIn,
                fanSpeedOut,
            });
        } catch (err) {
            console.error("Ошибка загрузки данных WhatsMiner:", err);
        }
    };

    useEffect(() => {
        fetchMinerData();
    }, [device]);

    if (!minerData) {
        return <div className="whatsminer-card">Загрузка данных...</div>;
    }

    return (
        <div className="whatsminer-card">
            <header className="card-header">
                <h3>{device.type} - {device.ip}</h3>
            </header>
            <div className="card-body">
                <p>Средний хэшрейт: {minerData.ghsAv} GH/s</p>
                <p>Входная скорость вентилятора: {minerData.fanSpeedIn} RPM</p>
                <p>Выходная скорость вентилятора: {minerData.fanSpeedOut} RPM</p>
            </div>
        </div>
    );
};

export default WhatsMinerCard;
