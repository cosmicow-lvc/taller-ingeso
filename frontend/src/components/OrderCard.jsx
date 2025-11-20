import React from "react";
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

export default function OrderCard({ id, status, purchaseDate, deliveryDate }) {
  return (
    <article className="order-card">
      <div className="order-card-header">
        <span className={statusClass(status)}>{status}</span>
        <strong className="order-id">Pedido #{id}</strong>
      </div>

      <div className="order-card-body">
        <div className="order-row">
          <span className="label">Fecha compra:</span>
          <span className="value">{purchaseDate}</span>
        </div>
        <div className="order-row">
          <span className="label">Fecha entrega:</span>
          <span className="value">{deliveryDate}</span>
        </div>
      </div>
    </article>
  );
}