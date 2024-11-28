import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Header from "./Header";
import ContextCard from "./ContextCard";
import Modal from "./Modal";
import CanvasBackground from "./CanvasBackground";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Dashboard from "./Dashboard";
import "./styles.css";

function App() {
    const [modal, setModal] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated");
        setIsAuthenticated(authStatus === "true");
    }, []);

    const openModal = (type) => {
        setModal(type);
    };

    const closeModal = () => {
        setModal(null);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        closeModal();
    };

    const handleRegister = () => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        closeModal();
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
    };

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: "#90caf9",
            },
            secondary: {
                main: "#f48fb1",
            },
            background: {
                default: "#121212",
                paper: "#1e1e1e",
            },
            text: {
                primary: "#ffffff",
                secondary: "#bbbbbb",
            },
        },
        typography: {
            fontFamily: "Roboto, Arial, sans-serif",
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <CanvasBackground />
                <AppBar position="static" style={{ background: "rgba(18, 18, 18, 0.8)" }}>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            style={{
                                flexGrow: 1,
                                color: "white",
                                fontWeight: 600,
                                textTransform: "uppercase",
                            }}
                        >
                            ASIC Control
                        </Typography>
                        {!isAuthenticated ? (
                            <>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    style={{ marginRight: "10px" }}
                                    onClick={() => openModal("login")}
                                >
                                    Login
                                </Button>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={() => openModal("register")}
                                >
                                    Register
                                </Button>
                            </>
                        ) : (
                            <Button color="error" variant="contained" onClick={handleLogout}>
                                Logout
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
                <div className="App">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/dashboard" replace />
                                ) : (
                                    <>
                                        <Header
                                            onLoginClick={() => openModal("login")}
                                            onRegisterClick={() => openModal("register")}
                                        />
                                        <ContextCard />
                                        {modal === "login" && (
                                            <Modal title="Login" onClose={closeModal}>
                                                <LoginForm onLogin={handleLogin} onClose={closeModal} />
                                            </Modal>
                                        )}
                                        {modal === "register" && (
                                            <Modal title="Register" onClose={closeModal}>
                                                <RegisterForm onRegister={handleRegister} onClose={closeModal} />
                                            </Modal>
                                        )}
                                    </>
                                )
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                isAuthenticated ? (
                                    <Dashboard onLogout={handleLogout} />
                                ) : (
                                    <Navigate to="/" replace />
                                )
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
