import React, { useState } from "react";
import Header from "./Header";
import CanvasBackground from "./CanvasBackground";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./styles.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleRegister = () => {
        setIsLoggedIn(true);
    };

    return (
        <div className="App">
            <CanvasBackground />
            <Header />
            {!isLoggedIn ? (
                <div className="container">
                    <LoginForm onLogin={handleLogin} />
                    <RegisterForm onRegister={handleRegister} />
                </div>
            ) : (
                <h1>Welcome to the Dashboard</h1>
            )}
        </div>
    );
}

export default App;
