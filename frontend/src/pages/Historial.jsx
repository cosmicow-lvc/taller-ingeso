import React from "react";
import "../styles/commons.css";
import "../styles/ordercard.css"
import Footer from "../components/Footer"
import Header from "../components/Header";
import OrderCard from "../components/OrderCard";


export default function Historial() {
  const mockOrders = [
    { id: "A123", status: "Entregado", purchaseDate: "2025-11-10", deliveryDate: "2025-11-15", products: [{name:"Zapato Gamer", qty:3, price: "30"}, {name:"Zapato Gamer", qty:3, price: "30"}, {name:"Zapato Gamer", qty:3, price: "30"}] },
    { id: "B456", status: "En camino", purchaseDate: "2025-11-12", deliveryDate: "2025-11-18", products: [{name:"Zapato Gamer", qty:3, price: "30"}, {name:"Zapato Gamer", qty:3, price: "30"}, {name:"Zapato Gamer", qty:3, price: "30"}] },
    { id: "C789", status: "En preparación", purchaseDate: "2025-11-14", deliveryDate: "—", products: [{name:"Zapato Gamer", qty:3, price: "30"}, {name:"Zapato Gamer", qty:3, price: "30"}, {name:"Zapato Gamer", qty:3, price: "30"}] }
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
              products={o.products}
            />
          ))}
          {mockOrders.map((o) => (
            <OrderCard
              key={o.id}
              id={o.id}
              status={o.status}
              purchaseDate={o.purchaseDate}
              deliveryDate={o.deliveryDate}
              products={o.products}
            />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};