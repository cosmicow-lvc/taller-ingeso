import React from "react";
import "../styles/QuienesSomos.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
//import quienesImg from "../media/quienes-somos.jpg";

export default function QuienesSomos() {
  return (
    <div className="quienes-somos-page">
      <Header />
      <main className="container">
        <section className="quienes-somos">
          <div className="texto">
            <h2>Quiénes Somos</h2>
            <p>
              Somos una empresa apasionada por ofrecer lo mejor en el mundo de la tecnología tanto para aquellos que busquen
              tanto calidad como precio, o un balance entre los dos, no encontrarás nadie mejor que nosotros!
            </p>
            <p>
              Creemos en la dedicación, la cercanía y la mejora constante. Conectamos con nuestra clientela y siempre
              estamos dispuestos a ayudar, no dudes en contactarnos.
            </p>
            <p>
              Gracias por acompañarnos en este camino. Seguimos creciendo para ti.
            </p>
          </div>

          <div className="imagen">
            <img src={null} alt="Equipo de trabajo" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}