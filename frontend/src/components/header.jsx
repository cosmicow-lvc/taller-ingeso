import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";
import cartSvg from "../media/shopping-cart-outline.svg";
import logo from "../media/logo-transparente.png";

export default function Header() {
  const { totalCount, toggle } = useCart();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("usuario");
      if (raw) setUsuario(JSON.parse(raw));
      else setUsuario(null);
    } catch {}

    const onStorage = (e) => {
      if (e.key === "usuario") {
        try {
          const raw = e.newValue;
          if (raw) setUsuario(JSON.parse(raw));
          else setUsuario(null);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <>
      <header className="navbar">
        <nav className="h-izquierda">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo-img" />
          </Link>
          <Link to="/catalogo">Catalogo</Link>
          <Link to="/quienes-somos">Quienes somos</Link>
          <Link to="/contacto">Contáctanos</Link>
        </nav>
        <div className="h-derecha">
          <input type="text" id="barraBuscarProd" placeholder="Buscar Producto" />
          {usuario ? (
            <Link to="/perfil">{usuario?.nombre || "Perfil"}</Link>
          ) : (
            <Link to="/login">Iniciar sesión</Link>
          )}

          {/* Icono de carrito */}
          <button aria-label="Abrir carrito" onClick={toggle} style={{marginLeft:12, padding:8, position:"relative"}} className="carro">
            <img src={cartSvg} alt="Carrito" style={{width:20,height:20,display:"block"}} />
            {totalCount > 0 && (
              <span style={{
                position:"absolute", top:-6, right:-6, background:"#f24f13", color:"#fff",
                borderRadius:999, padding:"2px 6px", fontSize:12, fontWeight:800
              }}>{totalCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Drawer del carrito se monta aquí para que esté disponible en todas las páginas que usan Header */}
      <Cart />
    </>
  );
}