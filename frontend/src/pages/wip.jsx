import React from "react";
import "../styles/login.css";
import "../styles/commons.css";
import Footer from "../components/footer"
import Header from "../components/Header";
import wip from "../media/wip.png"

export default function Wip() {
  return (
    <div>
      <Header />

      <main className="container">
        <a href="/landing" className="volver">← Volver</a>
        <div className="login-box" style={{ textAlign: "center" }}>
          <img src={wip} alt="WIP" style={{ opacity: 0.4, maxWidth: "100%" }} />
          <p>Estamos trabajando en ello</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};