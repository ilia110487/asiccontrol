import React, { useState } from "react";
import "./Header.css";

const Header = ({ onLoginClick, onRegisterClick }) => {
    return (
        <header className="header">
            <div className="logo">
                AsicControl
            </div>
            <div className="actions">
                <button className="header-btn" onClick={onLoginClick}>
                    Login
                </button>
                <button className="header-btn" onClick={onRegisterClick}>
                    Register
                </button>
            </div>
        </header>
    );
};

export default Header;
