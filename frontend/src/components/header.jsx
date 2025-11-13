import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="navbar">
      <nav className="h-izquierda">
        <span className="logo">Logo</span>
        <Link to="/catalogo">Catalogo</Link>
        <Link to="/wip">Quienes somos</Link>
        <Link to="/wip">Contactanos</Link>
      </nav>
      <div className="h-derecha">
        <input type="text" id="barraBuscarProd" placeholder="Buscar Producto" />
        <Link to="/login">Iniciar sesión</Link>
      </div>
    </header>
  );
}