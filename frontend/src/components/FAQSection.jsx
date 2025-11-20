import React, { useState } from "react";
import "../styles/faq.css";

const faqData = [
  {
    categoria: "Productos",
    preguntas: [
      {
        pregunta: "¿Cómo puedo saber si un producto está en stock?",
        respuesta:
          "En cada página de producto verás la disponibilidad actualizada. Si dice 'En stock', puedes realizar tu compra inmediatamente. Si está agotado, puedes suscribirte para recibir una notificación cuando vuelva a estar disponible.",
      },
      {
        pregunta: "¿Los productos tienen garantía?",
        respuesta:
          "Sí, todos nuestros productos tecnológicos cuentan con garantía del fabricante. El plazo varía según el producto, generalmente entre 6 meses y 2 años. Consulta los detalles específicos en la descripción de cada producto.",
      },
      {
        pregunta: "¿Puedo ver las especificaciones técnicas completas?",
        respuesta:
          "Absolutamente. En cada página de producto encontrarás una sección detallada con todas las especificaciones técnicas, características, dimensiones y contenido de la caja.",
      },
    ],
  },
  {
    categoria: "Envíos y Entregas",
    preguntas: [
      {
        pregunta: "¿Cuánto demora el envío?",
        respuesta:
          "Los envíos dentro de Santiago se realizan en 24-48 horas hábiles. Para regiones, el tiempo estimado es de 3-5 días hábiles. Ofrecemos envío express con entrega al día siguiente por un costo adicional.",
      },
      {
        pregunta: "¿Cuál es el costo de envío?",
        respuesta:
          "El costo de envío varía según la región y el peso del producto. En compras sobre $50.000, el envío es gratuito a todo Chile. Puedes ver el costo exacto antes de finalizar tu compra.",
      },
      {
        pregunta: "¿Puedo retirar en tienda?",
        respuesta:
          "Sí, ofrecemos retiro en nuestra tienda ubicada en Javier Díaz #6969. Selecciona esta opción al finalizar tu compra y te notificaremos cuando tu pedido esté listo para retirar.",
      },
    ],
  },
  {
    categoria: "Pagos",
    preguntas: [
      {
        pregunta: "¿Qué métodos de pago aceptan?",
        respuesta:
          "Aceptamos tarjetas de crédito (Visa, Mastercard, American Express), tarjetas de débito, transferencia bancaria y pago en efectivo al retirar en tienda. También trabajamos con Mercado Pago.",
      },
      {
        pregunta: "¿Puedo pagar en cuotas?",
        respuesta:
          "Sí, aceptamos pagos en cuotas con tarjetas de crédito. El número de cuotas disponibles depende de tu banco y el monto de la compra. Las opciones se mostrarán al momento de pagar.",
      },
      {
        pregunta: "¿Es seguro comprar en este sitio?",
        respuesta:
          "Completamente seguro. Nuestro sitio utiliza certificado SSL y todos los pagos se procesan a través de plataformas certificadas. Nunca almacenamos información sensible de tarjetas de crédito.",
      },
    ],
  },
  {
    categoria: "Devoluciones y Cambios",
    preguntas: [
      {
        pregunta: "¿Cuál es la política de devoluciones?",
        respuesta:
          "Tienes 30 días desde la recepción del producto para solicitar una devolución o cambio. El producto debe estar en perfecto estado, sin uso, con todos sus accesorios y en su empaque original.",
      },
      {
        pregunta: "¿Cómo solicito un cambio?",
        respuesta:
          "Puedes solicitar un cambio contactándonos por email o teléfono. Te proporcionaremos las instrucciones para el envío del producto y coordinaremos el envío del nuevo artículo.",
      },
      {
        pregunta: "¿Quién paga el envío de la devolución?",
        respuesta:
          "Si el producto presenta algún defecto o error de nuestra parte, cubrimos el costo del envío. En caso de arrepentimiento de compra, el costo del envío es responsabilidad del cliente.",
      },
    ],
  },
  {
    categoria: "Cuenta y Pedidos",
    preguntas: [
      {
        pregunta: "¿Necesito crear una cuenta para comprar?",
        respuesta:
          "No es obligatorio, pero te recomendamos crear una cuenta para facilitar futuras compras, hacer seguimiento de tus pedidos y acceder a ofertas exclusivas.",
      },
      {
        pregunta: "¿Cómo puedo rastrear mi pedido?",
        respuesta:
          "Una vez despachado tu pedido, recibirás un email con el número de seguimiento. También puedes revisar el estado de tu pedido ingresando a tu cuenta en la sección 'Mis Pedidos'.",
      },
      {
        pregunta: "¿Puedo modificar o cancelar mi pedido?",
        respuesta:
          "Puedes modificar o cancelar tu pedido solo si aún no ha sido despachado. Contáctanos lo antes posible por teléfono o email para gestionar el cambio.",
      },
    ],
  },
];

export default function FAQSection() {
  const [categoriaActiva, setCategoriaActiva] = useState("Productos");
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  const togglePregunta = (index) => {
    setPreguntaAbierta(preguntaAbierta === index ? null : index);
  };

  const categoriaSeleccionada = faqData.find((cat) => cat.categoria === categoriaActiva);

  return (
    <section className="faq-section">
      <h2>Preguntas Frecuentes</h2>
      <p className="faq-descripcion">
        Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros productos y servicios.
      </p>

      <div className="faq-container">
        {/* Tabs de categorías */}
        <div className="faq-categorias">
          {faqData.map((categoria) => (
            <button
              key={categoria.categoria}
              className={`categoria-btn ${categoriaActiva === categoria.categoria ? "activa" : ""}`}
              onClick={() => {
                setCategoriaActiva(categoria.categoria);
                setPreguntaAbierta(null);
              }}
            >
              {categoria.categoria}
            </button>
          ))}
        </div>

        {/* Lista de preguntas */}
        <div className="faq-preguntas">
          {categoriaSeleccionada?.preguntas.map((item, index) => (
            <div key={index} className="faq-item">
              <button className="faq-pregunta" onClick={() => togglePregunta(index)}>
                <span>{item.pregunta}</span>
                <span className={`faq-icono ${preguntaAbierta === index ? "abierto" : ""}`}>
                  {preguntaAbierta === index ? "−" : "+"}
                </span>
              </button>
              {preguntaAbierta === index && (
                <div className="faq-respuesta">
                  <p>{item.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
