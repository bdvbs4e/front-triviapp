// src/pages/Auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/global.css";
import "../../styles/auth.css";
import logo from "../../assets/logo.png";
import { createUser } from "../../services/user.services";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const newUser = { name: name.trim(), email: email.trim(), password };
    await createUser(newUser);
    navigate("/login");
  };

  return (
    <div className="screen">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="brand-logo" />
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Regístrate para unirte a partidas</p>

        <form onSubmit={handleRegister} className="auth-form">
          <label className="input-label">Nombre</label>
          <input
            type="text"
            className="auth-input"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <label className="input-label">Correo</label>
          <input
            type="email"
            className="auth-input"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            inputMode="email"
            autoComplete="email"
          />

          <label className="input-label">Contraseña</label>
          <input
            type="password"
            className="auth-input"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary">Registrarme</button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
