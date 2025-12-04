import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/landing.css";
import "../styles/commons.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StaticParticles from "../components/StaticParticles";
import { useCart } from "../context/CartContext";
import logo from "../media/logo-transparente.png";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Landing() {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function loadProducts(){
            try {
                const response = await fetch(`${API_URL}/productos`);
                if (!response.ok) throw new Error("Error al consultar el catálogo");
                const payload = await response.json();
                setProducts(payload);
            } catch (error) {
                console.error("No pudimos cargar el catálogo.");
            }
        }
        loadProducts();
    }, []);

    const randomProductsForMosaics = useMemo(() => {
        if (products.length < 12) return { set1: [], set2: [], set3: [] };
        const shuffled = [...products].sort(() => Math.random() - 0.5);
        return {
            set1: shuffled.slice(0, 4),
            set2: shuffled.slice(4, 8),
            set3: shuffled.slice(8, 12)
        };
    }, [products]);

    const randomProductsForDisplay = useMemo(() => {
        if (products.length < 15) return [];
        const shuffled = [...products].sort(() => Math.random() - 0.5);
        return shuffled.slice(12, 15);
    }, [products]);

    const handleAddToCart = (product) => {
        const imageUrl = product.image?.startsWith('http') ? product.image : `${API_URL}${product.image}`;
        addItem({
            productId: product.id,
            variantId: null,
            name: product.name,
            price: product.price,
            qty: 1,
            meta: { subtitle: product.brand, image: imageUrl }
        });
    };

    return (
        <>
            <Header />

            <main className="landing-main">
                <section className="hero">
                    <div className="hero-text">
                        <img src={logo} alt="Logo" className="hero-logo" />
                        <p>
                            Descubre la mejor tecnología, al mejor precio y en el mejor lugar. 
                        </p>
                        <Link to="/catalogo">
                            <button className="btn">Catálogo</button>
                        </Link>
                    </div>
                </section>

                <section className="categorias">
                    <div className="card" onClick={() => navigate('/catalogo')}>
                        <div className="mosaic-grid">
                            {randomProductsForMosaics.set1.length > 0 ? randomProductsForMosaics.set1.map((product, idx) => (
                                <div key={idx} className="mosaic-item">
                                    <img src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`} alt={product.name} onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                            )) : null}
                        </div>
                        <h2>Productos</h2>
                    </div>
                    <div className="card" onClick={() => navigate('/catalogo')}>
                        <div className="mosaic-grid">
                            {randomProductsForMosaics.set2.length > 0 ? randomProductsForMosaics.set2.map((product, idx) => (
                                <div key={idx} className="mosaic-item">
                                    <img src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`} alt={product.name} onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                            )) : null}
                        </div>
                        <h2>Paquetes</h2>
                    </div>
                    <div className="card" onClick={() => navigate('/catalogo')}>
                        <div className="mosaic-grid">
                            {randomProductsForMosaics.set3.length > 0 ? randomProductsForMosaics.set3.map((product, idx) => (
                                <div key={idx} className="mosaic-item">
                                    <img src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`} alt={product.name} onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                            )) : null}
                        </div>
                        <h2>Ofertas</h2>
                    </div>
                </section>

                <section className="productos">
                    <h2 className="section-heading">Bienvenido</h2>
                    <p className="section-subtitle">Estos son los productos recién añadidos</p>

                    <div className="productos-grid">
                        {randomProductsForDisplay.map((product) => (
                            <div className="card" key={product.id}>
                                <img 
                                    src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`} 
                                    alt={product.name} 
                                    className="product-image" 
                                    onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120"%3E%3Crect fill="%23475569" width="200" height="120"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23cbd5e1" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'; }} 
                                />
                                <h3>{product.name}</h3>
                                <p>{product.brand}</p>
                                <div className="price-and-button">
                                    <span className="price-tag">${product.price}</span>
                                    <button className="btn-add-cart" onClick={() => handleAddToCart(product)}>Añadir al carro</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

