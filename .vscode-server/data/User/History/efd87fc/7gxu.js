import React from "react";
import "./Dashboard.css";

const Dashboard = ({ onLogout }) => {
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>AsicControl Dashboard</h1>
                <button className="logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </header>
            <div className="add-asic-wrapper">
                <div className="add-asic">
                    <span className="plus-icon">+</span>
                </div>
                <p className="add-asic-text">Add new ASIC device</p>
            </div>
        </div>
    );
};

export default Dashboard;
