import React, { useState } from "react";
import "./AddDeviceForm.css";

const AddDeviceForm = ({ onCancel }) => {
    const [ip, setIp] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [deviceType, setDeviceType] = useState("antminer");

    const handleSubmit = (e) => {
        e.preventDefault();
        const deviceData = { ip, login, password, deviceType };
        console.log("Device added:", deviceData);
        // Здесь можно отправить данные на сервер
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