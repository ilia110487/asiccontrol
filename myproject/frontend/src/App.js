import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import ContextCard from "./ContextCard";
import Modal from "./Modal";
import CanvasBackground from "./CanvasBackground";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Dashboard from "./Dashboard";
import "./styles.css";

function App() {
    const [modal, setModal] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Проверяем авторизацию при загрузке приложения
    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated");
        setIsAuthenticated(authStatus === "true");
    }, []);

    const openModal = (type) => {
        setModal(type);
    };

    const closeModal = () => {
        setModal(null);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true"); // Сохраняем авторизацию в localStorage
        closeModal();
    };

    const handleRegister = () => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true"); // Сохраняем авторизацию в localStorage
        closeModal();
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated"); // Удаляем информацию об авторизации
    };

    return (
        <Router>
            <CanvasBackground />
            <div className="App">
                <Routes>
                    {/* Главная страница зависит от статуса авторизации */}
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <>
                                    <Header
                                        onLoginClick={() => openModal("login")}
                                        onRegisterClick={() => openModal("register")}
                                    />
                                    <ContextCard />
                                    {modal === "login" && (
                                        <Modal title="Login" onClose={closeModal}>
                                            <LoginForm onLogin={handleLogin} />
                                        </Modal>
                                    )}
                                    {modal === "register" && (
                                        <Modal title="Register" onClose={closeModal}>
                                            <RegisterForm onRegister={handleRegister} />
                                        </Modal>
                                    )}
                                </>
                            )
                        }
                    />
                    {/* Дашборд */}
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated ? (
                                <Dashboard onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    {/* Добавляем обработчик для неизвестных маршрутов */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
