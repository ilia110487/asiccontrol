import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = ({ onLogin, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Logged in:", email, password);
        onLogin();
        navigate("/dashboard");
    };

    return (
        <div className="login-container">
            <div className="login-panel">
                {/* Кнопка закрытия */}
                <button className="close-button" onClick={onClose} title="Close">
                    ✖
                </button>
                <h1 className="login-title">ASIC Control Login</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-wrapper">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <span className="input-highlight"></span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="input-highlight"></span>
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
            <div className="login-glow"></div>
        </div>
    );
};

export default LoginForm;
