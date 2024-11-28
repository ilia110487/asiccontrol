import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

const RegisterForm = ({ onRegister, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError(null);

        console.log("Registered:", email, password);
        onRegister();
        navigate("/dashboard");
    };

    return (
        <div className="register-container">
            <div className="register-panel">
                <button className="close-button" onClick={onClose} title="Close">
                    ✖
                </button>
                <h1 className="register-title">ASIC Control Register</h1>
                <form onSubmit={handleSubmit} className="register-form">
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
                    <div className="input-wrapper">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span className="input-highlight"></span>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
            <div className="register-glow"></div>
        </div>
    );
};

export default RegisterForm;
