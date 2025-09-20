// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Lobby from "../pages/game/lobby";
import QuestionPanel from "../pages/game/QuestionPanel";
import Results from "../pages/game/Results";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/question" element={<QuestionPanel />} /> {/* 👈 nueva ruta */}
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}