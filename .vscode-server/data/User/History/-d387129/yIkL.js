import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ onRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Используем для перехода

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registered:", email, password);
        onRegister(); // Уведомляем родительский компонент
        navigate("/dashboard"); // Переход в Dashboard
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
