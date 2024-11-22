import React, { useState } from "react";
import Modal from "./Modal"; // Подключаем компонент Modal
import "./Dashboard.css";
import AddDeviceForm from "./AddDeviceForm"; // Импортируем AddDeviceForm

const Dashboard = ({ onLogout }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>AsicControl Dashboard</h1>
                <button className="logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </header>
            <div className="add-asic-wrapper" onClick={openModal}>
                <div className="add-asic">
                    <span className="plus-icon">+</span>
                </div>
                <p className="add-asic-text">Add new ASIC device</p>
            </div>
            {isModalOpen && (
                <Modal title="Add ASIC Device" onClose={closeModal}>
                    <AddDeviceForm onCancel={closeModal} />
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;
