import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import AddDeviceForm from "./AddDeviceForm";
import AntminerCard from "./AsicCards/AntminerCard";
import WhatsMinerCard from "./AsicCards/WhatsMinerCard"; // Убедитесь, что этот компонент подключен
import "./Dashboard.css";

const Dashboard = ({ onLogout }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null); // Для отображения ошибки загрузки устройств

    // Получение списка устройств из API
    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/devices/");
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }
                const data = await response.json();
                console.log("[DEBUG] Устройства, загруженные из API:", data);
                setDevices(data);
            } catch (err) {
                console.error("Ошибка загрузки устройств:", err);
                setError("Не удалось загрузить список устройств. Проверьте подключение к серверу.");
            }
        };

        fetchDevices();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Добавление нового устройства
    const addDevice = async (newDevice) => {
        try {
            const csrftoken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("csrftoken="))
                ?.split("=")[1];

            const response = await fetch("http://127.0.0.1:8000/api/devices/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken, // Передача CSRF-токена
                },
                body: JSON.stringify(newDevice),
            });

            if (!response.ok) {
                throw new Error(`Ошибка добавления устройства: ${response.status}`);
            }

            const addedDevice = await response.json();
            console.log("[DEBUG] Устройство добавлено:", addedDevice);

            setDevices([...devices, addedDevice]); // Обновляем список устройств
            console.log("[DEBUG] Обновленный список устройств:", [...devices, addedDevice]);

            closeModal();
        } catch (err) {
            console.error("Ошибка добавления устройства:", err);
            setError("Не удалось добавить устройство. Проверьте данные и подключение к серверу.");
        }
    };

    // Удаление устройства
    const deleteDevice = async (deviceId) => {
        try {
            const csrftoken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("csrftoken="))
                ?.split("=")[1];

            const response = await fetch(`http://127.0.0.1:8000/api/devices/${deviceId}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": csrftoken, // Передача CSRF-токена
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка удаления устройства: ${response.status}`);
            }

            console.log("[DEBUG] Устройство удалено:", deviceId);
            setDevices(devices.filter((device) => device.id !== deviceId)); // Убираем устройство из списка
        } catch (err) {
            console.error("Ошибка удаления устройства:", err);
            setError("Не удалось удалить устройство. Попробуйте снова.");
        }
    };

    // Редактирование устройства
    const editDevice = (updatedDevice) => {
        setDevices(
            devices.map((device) =>
                device.id === updatedDevice.id ? { ...device, ...updatedDevice } : device
            )
        );
        console.log("[DEBUG] Устройство обновлено:", updatedDevice);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>AsicControl Dashboard</h1>
                <button className="logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </header>

            {error && <div className="error-message">{error}</div>} {/* Вывод ошибки */}

            <div className="device-grid">
                {devices.length > 0 ? (
                    devices.map((device) =>
                        device.type === "antminer" ? (
                            <AntminerCard
                                key={device.id}
                                device={device}
                                onEditDevice={editDevice}
                                onDeleteDevice={deleteDevice}
                            />
                        ) : device.type === "whatsminer" ? (
                            <WhatsMinerCard
                                key={device.id}
                                device={device}
                                onEditDevice={editDevice}
                                onDeleteDevice={deleteDevice}
                            />
                        ) : (
                            <div key={device.id}>Неизвестный тип устройства</div>
                        )
                    )
                ) : (
                    !error && <p className="no-devices">Нет добавленных устройств.</p>
                )}

                <div className="add-asic-wrapper" onClick={openModal}>
                    <div className="add-asic">
                        <span className="plus-icon">+</span>
                    </div>
                    <p className="add-asic-text">Add new ASIC device</p>
                </div>
            </div>

            {isModalOpen && (
                <Modal title="Add ASIC Device" onClose={closeModal}>
                    <AddDeviceForm onCancel={closeModal} onAddDevice={addDevice} />
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;
