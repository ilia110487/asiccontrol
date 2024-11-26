import React, { useState } from "react";

const DeviceMenu = ({ onEdit, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="device-menu">
            <div className="menu-icon" onClick={toggleMenu}>
                &#8942; {/* Три точки */}
            </div>
            {isMenuOpen && (
                <div className="menu-dropdown">
                    <button onClick={onEdit}>Редактировать</button>
                    <button onClick={onDelete}>Удалить</button>
                </div>
            )}
        </div>
    );
};

export default DeviceMenu;
