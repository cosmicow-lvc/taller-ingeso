import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/checkout.css";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fillMockData = () => {
    setFormData({
      fullName: "Juan Pérez García",
      email: "juan@example.com",
      phone: "+56 9 1234 5678",
      address: "Calle Principal 123, Apto 4B",
      city: "Santiago",
      postalCode: "8320000",
      cardName: "JUAN PEREZ",
      cardNumber: "4111 1111 1111 1111",
      expiryDate: "12/26",
      cvv: "123"
    });
  };

  if (items.length === 0 && !paymentSuccess) {
    return (
      <>
        <Header />
        <div className="checkout-container">
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2>Tu carrito está vacío</h2>
            <p>No hay items para procesar el pago.</p>
            <button 
              className="btn-checkout-primary" 
              onClick={() => navigate("/catalogo")}
            >
              Volver al catálogo
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setFormData(prev => ({
      ...prev,
      cardNumber: value
    }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setFormData(prev => ({
      ...prev,
      expiryDate: value
    }));
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setFormData(prev => ({
      ...prev,
      cvv: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.postalCode) {
      alert("Por favor completa todos los datos de envío");
      return false;
    }
    if (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      alert("Por favor completa todos los datos de la tarjeta");
      return false;
    }
    if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("El número de tarjeta debe tener 16 dígitos");
      return false;
    }
    if (formData.expiryDate.length !== 5) {
      alert("La fecha de vencimiento debe estar en formato MM/YY");
      return false;
    }
    if (formData.cvv.length !== 3) {
      alert("El CVV debe tener 3 dígitos");
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Obtener token de autenticación
      const token = localStorage.getItem("token");
      console.log("Token del localStorage:", token);
      
      if (!token) {
        alert("Por favor inicia sesión para completar la compra");
        setIsProcessing(false);
        navigate("/login");
        return;
      }

      // Guardar la compra en el backend
      // Sanitizar items para enviar solo propiedades necesarias
      const sanitizedItems = items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        brand: item.brand,
        category: item.category,
        meta: item.meta ? { image: item.meta.image } : undefined
      }));

      console.log("Items sanitizados:", JSON.stringify(sanitizedItems, null, 2));
      if (sanitizedItems[0]) {
        console.log("Item 0 price:", sanitizedItems[0].price, "tipo:", typeof sanitizedItems[0].price);
        console.log("Item 0 qty:", sanitizedItems[0].qty, "tipo:", typeof sanitizedItems[0].qty);
      }

      const compraData = {
        nombre_completo: formData.fullName,
        email: formData.email,
        telefono: formData.phone,
        direccion: formData.address,
        ciudad: formData.city,
        codigo_postal: formData.postalCode,
        monto_total: totalPrice,
        items: sanitizedItems
      };

      console.log("Enviando compra completa:", JSON.stringify(compraData, null, 2));

      console.log("Enviando compra:", compraData);
      console.log("Header Authorization:", `Bearer ${token}`);

      const response = await fetch(`${API_URL}/compras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(compraData)
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar la compra");
      }
      
      // Simulamos un pequeño delay de procesamiento
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentSuccess(true);
        clearCart();
      }, 800);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la compra: " + error.message);
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <>
        <Header />
        <div className="checkout-container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>¡Pago realizado exitosamente!</h2>
            <p>Gracias por tu compra. Tu pedido ha sido confirmado.</p>
            <div className="success-details">
              <p><strong>Nombre:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Monto total:</strong> ${totalPrice.toFixed(2)}</p>
              <p><strong>Envío a:</strong> {formData.address}, {formData.city} {formData.postalCode}</p>
            </div>
            <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
              Se ha enviado una confirmación a tu correo electrónico.
            </p>
            <button 
              className="btn-checkout-primary" 
              onClick={() => {
                setPaymentSuccess(false);
                navigate("/catalogo");
              }}
            >
              Volver al catálogo
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          {/* Formulario */}
          <div className="checkout-form">
            <form onSubmit={handlePayment}>
              {/* Sección de envío */}
              <div className="form-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3>Información de envío</h3>
                  <button 
                    type="button" 
                    onClick={fillMockData}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "transparent",
                      border: "1px solid var(--text)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: "var(--text)"
                    }}
                  >
                    Mock datos
                  </button>
                </div>
                <div className="form-group">
                  <label>Nombre completo *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="juan@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+56 9 XXXX XXXX"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Calle Principal 123, Apto 4B"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Santiago"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Código postal *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="8320000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sección de pago */}
              <div className="form-section">
                <h3>Información de pago</h3>
                <div className="form-group">
                  <label>Nombre en la tarjeta *</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="Como aparece en la tarjeta"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Número de tarjeta *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de vencimiento *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleCVVChange}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-checkout-primary"
                disabled={isProcessing}
                style={{ width: "100%", marginTop: "20px" }}
              >
                {isProcessing ? "Procesando..." : `Confirmar pago - $${totalPrice.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Resumen de orden */}
          <div className="checkout-summary">
            <h3>Resumen de la orden</h3>
            
            <div className="items-list">
              {items.map(item => (
                <div key={`${item.productId}:${item.variantId ?? "d"}`} className="summary-item">
                  <div className="item-thumb">
                    {item.meta?.image ? (
                      <img src={item.meta.image} alt={item.name} onError={(e)=>{e.target.style.display='none';}} />
                    ) : (
                      <span>Img</span>
                    )}
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    {item.meta?.subtitle && (
                      <div className="item-subtitle">{item.meta.subtitle}</div>
                    )}
                  </div>
                  <div className="item-quantity">x{item.qty}</div>
                  <div className="item-price">${(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="summary-row">
                <span>Impuestos</span>
                <span>Incluido</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/catalogo")}
              className="btn-continue-shopping"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
