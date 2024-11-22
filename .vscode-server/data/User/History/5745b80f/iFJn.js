import React, { useState } from "react";
import Header from "./Header";
import ContextCard from "./ContextCard";
import Modal from "./Modal";
import CanvasBackground from "./CanvasBackground";
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
            <ContextCard />
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
