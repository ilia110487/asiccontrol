import React, { useState } from "react";
import "./AddDeviceForm.css";

const AddDeviceForm = ({ onCancel, onAddDevice }) => {
    const [ip, setIp] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [deviceType, setDeviceType] = useState("antminer");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Создаем объект нового устройства
        const newDevice = {
            name: deviceType === "antminer" ? "Antminer" : "Wotsminer",
            ip,
            login,
            password,
            pool: "stratum+tcp://example.pool.com:3333", // Дефолтное значение, если нужно
            fans: [0, 0, 0, 0], // Дефолтные значения, можно заменить при получении данных
            boards: [
                { temp: 0, color: "#28a745" },
                { temp: 0, color: "#ffc107" },
                { temp: 0, color: "#dc3545" }
            ],
            hashrate: "0" // Дефолтное значение
        };

        // Передаём устройство в Dashboard через onAddDevice
        onAddDevice(newDevice);

        // Сбрасываем форму
        setIp("");
        setLogin("");
        setPassword("");
        setDeviceType("antminer");

        // Закрываем модальное окно
        onCancel();
    };

    return (
        <form className="add-device-form" onSubmit={handleSubmit}>
            <label>
                IP Address:
                <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="Enter IP address"
                    required
                />
            </label>
            <label>
                Login:
                <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Enter login"
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                />
            </label>
            <label>
                Device Type:
                <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                >
                    <option value="antminer">Antminer</option>
                    <option value="wotsminer">Wotsminer</option>
                </select>
            </label>
            <div className="form-buttons">
                <button type="submit" className="add-btn">
                    Add
                </button>
                <button type="button" className="cancel-btn" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddDeviceForm;
