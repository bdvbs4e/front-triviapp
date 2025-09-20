// src/pages/Auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/global.css";
import "../../styles/auth.css";
import logo from "../../assets/logo.png"; 
import { loginUser } from "../../services/user.services";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Llamamos al backend
      const user = await loginUser(email, password);
  
      // Guardar el usuario en localStorage (opcional)
      localStorage.setItem("user", JSON.stringify(user));
  
      // Actualizar estado global o redirigir
      console.log("Usuario logueado:", user);
      alert(`Bienvenido, ${user.name}`);

      navigate("/lobby");
  
      // si usas react-router, puedes redirigir:
      // navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas");
    } 

  };

  return (
    <div className="screen">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="brand-logo" />
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Ingresa para entrar al lobby de Preguntados</p>

        <form onSubmit={handleLogin} className="auth-form">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary">Entrar</button>
        </form>

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}
 