import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componemts/Login"; // Corrected path
import ChatRoom from "./componemts/ChatRoom"; // Corrected path
import Register from "./componemts/Register";
import Logout from "./componemts/Logout";
import Home from "./componemts/Home";
import { WebSocketProvider } from "./componemts/WebSocket/WebSocketContext";
import ProtectedRoute from "./componemts/auth/index";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setUser(user);
            console.log(user);
        });
        return () => unsub();
    }, []);

    return (
        <WebSocketProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/chat" element={<ProtectedRoute component={ChatRoom} />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/" element={<Navigate to="/home" replace />} />
                    </Routes>
                </BrowserRouter>
        </WebSocketProvider>
    );
}

export default App;