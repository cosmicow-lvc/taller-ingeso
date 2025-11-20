import React, { useState } from "react";
import "../styles/ordercard.css";

function statusClass(status) {
  if (!status) return "status pending";
  const s = status.toString().toLowerCase();
  if (s.includes("entreg")) return "status delivered";
  if (s.includes("camino") || s.includes("en camino")) return "status shipping";
  if (s.includes("prepar") || s.includes("en preparación")) return "status preparing";
  if (s.includes("cancel")) return "status cancelled";
  return "status pending";
}

export default function OrderCard({ id, status, purchaseDate, deliveryDate, products = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="order-card">
      <div className="order-card-header">
        <span className={statusClass(status)}>{status}</span>
        <strong className="order-id">Pedido #{id}</strong>
        <button
          className="details-btn"
          aria-expanded={open}
          aria-controls={`details-${id}`}
          onClick={() => setOpen((v) => !v)}
          title={open ? "Ocultar detalles" : "Ver detalles"}
          style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .18s ease" }}
        >
          ›
        </button>
      </div>

      <div className="order-card-body">
        <div className="order-row">
          <span className="label">Fecha compra:</span>
          <span className="value">{purchaseDate}</span>
        </div>
        <div className="order-row">
          <span className="label">Fecha entrega:  </span>
          <span className="value">{deliveryDate}</span>
        </div>
      </div>

      {open && (
        <div id={`details-${id}`} className="order-details">
          {products.length === 0 ? (
            <div className="no-products">No hay productos disponibles</div>
          ) : (
            <ul>
              {products.map((p, i) => (
                <li key={i} className="product-row">
                  <span className="product-name">{p.name}</span>
                  <span className="product-meta">
                    {p.qty ? `x${p.qty}` : ""}{p.price ? ` • ${p.price}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}