import React from "react";
import CanvasBackground from "./CanvasBackground";
import "./App.css";

function App() {
    return (
        <div className="App" style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
            <CanvasBackground />
            <header className="App-header" style={{ position: "relative", zIndex: 1 }}>
                <img src="./logo.svg" className="App-logo" alt="logo" />
                <h1>ASIC Dashboard</h1>
                <p>Edit <code>src/App.js</code> and save to reload.</p>
            </header>
        </div>
    );
}

export default App;
