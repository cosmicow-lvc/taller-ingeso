import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <span>Logo</span>
        <div className="flexx">
          <span>red1</span>
          <span>red2</span>
          <span>red3</span>
          <span>red4</span>
        </div>
      </div>

      <div>
        <div style={{ color: "white" }}>Ubicación: Javier Díaz #6969</div>
        <div style={{ color: "white" }}>Horarios de atención</div>
        <div style={{ color: "white" }}>Lunes a sábado 06:00 - 13:00</div>
        <div style={{ color: "white" }}>Domingo 10:00 - 18:00</div>
      </div>

      <nav className="nav">
        <p style={{ color: "white" }}>Ayuda</p>
        <a href="#" style={{ color: "white" }}>Preguntas frecuentes</a>
        <a href="#" style={{ color: "white" }}>Políticas de devolución</a>
        <a href="#" style={{ color: "white" }}>Contacto</a>
      </nav>

      <nav className="nav">
        <p style={{ color: "white" }}>Nosotros</p>
        <a href="#" style={{ color: "white" }}>Quienes somos</a>
        <a href="#" style={{ color: "white" }}>Misión, visión y valores</a>
        <a href="#" style={{ color: "white" }}>Historia</a>
      </nav>

      <nav className="nav">
        <p style={{ color: "white" }}>Otro</p>
        <a href="#" style={{ color: "white" }}>Loren ipsum</a>
        <Link to="/perfil" style={{ color: "white" }}>Loren ipsum</Link>
        <Link to="/atencion" style={{ color: "white" }}>Loren ipsum</Link>
      </nav>
    </footer>
  );
}