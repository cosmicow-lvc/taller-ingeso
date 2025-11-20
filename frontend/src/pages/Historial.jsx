import React from "react";
import "../styles/commons.css";
import "../styles/ordercard.css"
import Footer from "../components/Footer"
import Header from "../components/Header";
import OrderCard from "../components/OrderCard";


export default function Historial() {
  const mockOrders = [
    { id: "A123", status: "Entregado", purchaseDate: "2025-11-10", deliveryDate: "2025-11-15" },
    { id: "B456", status: "En camino", purchaseDate: "2025-11-12", deliveryDate: "2025-11-18" },
    { id: "C789", status: "En preparación", purchaseDate: "2025-11-14", deliveryDate: "—" }
  ];

  return (
    <div>
      <Header />

      <main className="container">
        <h2>Historial de pedidos</h2>

        <section>
          {mockOrders.map((o) => (
            <OrderCard
              key={o.id}
              id={o.id}
              status={o.status}
              purchaseDate={o.purchaseDate}
              deliveryDate={o.deliveryDate}
            />
          ))}
          {mockOrders.map((o) => (
            <OrderCard
              key={o.id}
              id={o.id}
              status={o.status}
              purchaseDate={o.purchaseDate}
              deliveryDate={o.deliveryDate}
            />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};