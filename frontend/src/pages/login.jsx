import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import "../styles/commons.css";
import Header from "../components/Header";
import Footer from "../components/footer";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validEmail = "usuario@prueba.com";
  const validPassword = "123456";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (email === validEmail && password === validPassword) {
      // éxito -> navegar al landing (ajusta la ruta si usas otra)
      navigate("/landing");
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div>
      <Header />

      <main className="container">
        <Link to="/landing" className="volver">← Volver</Link>

        <div className="login-box">
          <div className="logo">Logo</div>
          <h2>Iniciar sesión</h2>

          <form id="loginForm" onSubmit={handleSubmit}>
            <input
              className="input-principal"
              type="email"
              id="email"
              placeholder="Correo"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="input-principal"
              type="password"
              id="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div id="error-message" className="error-message" style={{ display: error ? "block" : "none", color: "red" }}>
              {error}
            </div>

            <Link to="#" className="forgot">¿Olvidó la contraseña?</Link>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="submit" className="btn continuar">Continuar</button>
              <Link to="/registro"><button type="button" className="btn registrarse">Registrarse</button></Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}