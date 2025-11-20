import React from "react";
import "../styles/QuienesSomos.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import tarjetaMaximo from "../media/tarjetas/tarjeta-maximo.png";
import tarjetaMaximiliano from "../media/tarjetas/tarjeta-maximiliano.png";
import tarjetaJulian from "../media/tarjetas/tarjeta-julian.png";
import tarjetaNicolas from "../media/tarjetas/tarjeta-nicolas.png";

export default function QuienesSomos() {
  const teamMembers = [
    {
      name: "Máximo",
      email: "maximo.jofre@alumnos.ucn.cl",
      image: tarjetaMaximo,
      alt: "Tarjeta Maximo",
    },
    {
      name: "Maximiliano",
      email: "maximiliano.urrutia@alumnos.ucn.cl",
      image: tarjetaMaximiliano,
      alt: "Tarjeta Maximiliano",
    },
    {
      name: "Julián",
      email: "julian.gallardo@alumnos.ucn.cl",
      image: tarjetaJulian,
      alt: "Tarjeta Julian",
    },
    {
      name: "Nicolás",
      email: "nicolas.cordero01@alumnos.ucn.cl",
      image: tarjetaNicolas,
      alt: "Tarjeta Nicolas",
    },
  ];

  const handleContact = (email) => {
    window.location.href = `mailto:${email}?subject=Consulta%20sobre%20Daft%20Punk`;
  };

  return (
    <>
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
          </section>

          <div className="equipo-tarjetas">
            {teamMembers.map((member) => (
              <div className="tarjeta-contenedor" key={member.email}>
                <button
                  type="button"
                  className="tarjeta-trigger"
                  onClick={() => handleContact(member.email)}
                  aria-label={`Contactar a ${member.name}`}
                >
                  <img src={member.image} alt={member.alt} className="tarjeta-equipo" />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}