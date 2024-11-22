import React, { useState } from "react";
import Header from "./Header";
import CanvasBackground from "./CanvasBackground";
import CanvasAsic from "./CanvasAsic";
import Modal from "./Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./styles.css";

function App() {
    const [modal, setModal] = useState(null);

    const openModal = (type) => {
        setModal(type);
    };

    const closeModal = () => {
        setModal(null);
    };

    return (
        <div className="App">
            <CanvasBackground />
            <Header
                onLoginClick={() => openModal("login")}
                onRegisterClick={() => openModal("register")}
            />
            <div className="container">
                <CanvasAsic />
                <p>
                    Наш сервис позволяет вам легко следить за состоянием вашего
                    оборудования. А также незамедлительные уведомления при
                    неполадках!
                </p>
            </div>
            {modal === "login" && (
                <Modal title="Login" onClose={closeModal}>
                    <LoginForm onLogin={closeModal} />
                </Modal>
            )}
            {modal === "register" && (
                <Modal title="Register" onClose={closeModal}>
                    <RegisterForm onRegister={closeModal} />
                </Modal>
            )}
        </div>
    );
}

export default App;
