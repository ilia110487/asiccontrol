import React, { useState } from "react";
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

    const openModal = (type) => {
        setModal(type);
    };

    const closeModal = () => {
        setModal(null);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        closeModal();
    };

    const handleRegister = () => {
        setIsAuthenticated(true);
        closeModal();
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <CanvasBackground />
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
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
                        }
                    />
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
                </Routes>
            </div>
        </Router>
    );
}

export default App;
