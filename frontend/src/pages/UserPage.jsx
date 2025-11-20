import React from "react";
import { Link } from "react-router-dom";
import "../styles/user.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserPage() {
  // datos de ejemplo — reemplaza por props / fetch cuando los tengas
  const user = {
    nombre: "Juan",
    apellido: "Pérez",
    nacimiento: "12/03/2004",
  };

  return (
    <div className="user-page">
      <Header />

      <main className="container">
        <Link to="/landing" className="volver">← Volver</Link>

        <div className="perfil-box">
          <div className="avatar" aria-hidden="true">
            {user.nombre?.[0] ?? "U"}
          </div>

          <h2>Perfil de Usuario</h2>

          <div className="info-usuario">
            <div className="info-item">
              <strong>Nombre:</strong>
              <span>{user.nombre}</span>
            </div>

            <div className="info-item">
              <strong>Apellido:</strong>
              <span>{user.apellido}</span>
            </div>

            <div className="info-item">
              <strong>Fecha de nacimiento:</strong>
              <span>{user.nacimiento}</span>
            </div>

            <div className="info-item">
              <strong>Contraseña:</strong>
              <span>********</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}