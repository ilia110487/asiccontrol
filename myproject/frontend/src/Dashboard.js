import React, { useState } from "react";
import Modal from "./Modal"; // Подключаем компонент Modal
import "./Dashboard.css";
import AddDeviceForm from "./AddDeviceForm"; // Импортируем AddDeviceForm
import AntminerCard from "./AsicCards/AntminerCard"; // Импортируем компонент карточки ASIC

const Dashboard = ({ onLogout }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
    const [devices, setDevices] = useState([]); // Состояние для списка ASIC устройств

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Функция добавления устройства
    const addDevice = (newDevice) => {
        setDevices([...devices, newDevice]); // Добавляем новое устройство в список
        closeModal(); // Закрываем модальное окно
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>AsicControl Dashboard</h1>
                <button className="logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </header>

            <div className="device-grid">
                {devices.map((device, index) => (
                    <AntminerCard key={index} device={device} />
                ))}

                {/* Рамка для добавления нового устройства */}
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
