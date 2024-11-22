import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import ContextCard from "./ContextCard";
import Modal from "./Modal";
import CanvasBackground from "./CanvasBackground";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Dashboard from "./Dashboard"; // Добавим компонент Dashboard
import "./styles.css";

function App() {
    const [modal, setModal] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Статус авторизации

    const openModal = (type) => {
        setModal(type);
    };

    const closeModal = () => {
        setModal(null);
    };

    const handleLogin = () => {
        setIsAuthenticated(true); // Устанавливаем статус авторизации
        closeModal(); // Закрываем модальное окно
    };

    const handleRegister = () => {
        setIsAuthenticated(true); // Устанавливаем статус авторизации
        closeModal(); // Закрываем модальное окно
    };

    return (
        <Router>
            <CanvasBackground />
            <div className="App">
                <Header
                    onLoginClick={() => openModal("login")}
                    onRegisterClick={() => openModal("register")}
                />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
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
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated ? (
                                <Dashboard />
                            ) : (
                                <Navigate to="/" replace /> // Редирект на главную страницу, если не авторизован
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
