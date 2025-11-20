import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQSection from "../components/FAQSection";
import "../styles/contacto.css";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [respuesta, setRespuesta] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setRespuesta(null);
    const payload = { ...formData };

    try {
      const response = await fetch("http://localhost:3000/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setRespuesta({
          tipo: "exito",
          mensaje: "¡Tu consulta ha sido enviada exitosamente! Nos pondremos en contacto contigo pronto.",
        });
        const mailSubject = encodeURIComponent(`[Consulta] ${payload.asunto}`);
        const mailBody = encodeURIComponent(
          `Nombre: ${payload.nombre}\nCorreo: ${payload.email}\n\nMensaje:\n${payload.mensaje}`
        );
        window.location.href = `mailto:nico.cordero.varas@gmail.com?subject=${mailSubject}&body=${mailBody}`;
        setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
      } else {
        throw new Error("Error al enviar la consulta");
      }
    } catch (error) {
      setRespuesta({
        tipo: "error",
        mensaje: "Hubo un problema al enviar tu consulta. Por favor, intenta nuevamente.",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contacto-page">
      <Header />

      <main className="contacto-container">
        <section className="contacto-hero">
          <h1>Contáctanos</h1>
          <p>¿Tienes alguna pregunta o consulta? Estamos aquí para ayudarte.</p>
        </section>

        <div className="contacto-content">
          {/* Formulario de contacto */}
          <section className="formulario-section">
            <h2>Envíanos tu consulta</h2>
            <form onSubmit={handleSubmit} className="contacto-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="asunto">Asunto *</label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Escribe tu consulta aquí..."
                ></textarea>
              </div>

              <button type="submit" className="btn-enviar" disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar consulta"}
              </button>

              {respuesta && (
                <div className={`mensaje-respuesta ${respuesta.tipo}`}>
                  {respuesta.mensaje}
                </div>
              )}
            </form>
          </section>
        </div>

        {/* Sección de Preguntas Frecuentes */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
