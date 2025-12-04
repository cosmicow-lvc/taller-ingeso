import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import "../styles/commons.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Guardar información del usuario y token en localStorage
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("token", data.token);
        // Navegar al perfil o landing
        navigate("/perfil");
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <main className="container">
        <Link to="/" className="volver">← Volver</Link>

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
              <button type="submit" className="btn continuar" disabled={loading}>
                {loading ? "Iniciando..." : "Continuar"}
              </button>
              <Link to="/registro"><button type="button" className="btn registrarse">Registrarse</button></Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}