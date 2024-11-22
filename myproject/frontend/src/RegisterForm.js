import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ onRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null); // Для отображения ошибки
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Проверяем совпадение паролей
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Убираем ошибку, если всё верно
        setError(null);

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
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Отображение ошибки */}
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
