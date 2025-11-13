import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";
import "../styles/commons.css";
import Footer from "../components/footer";
import Header from "../components/Header";

export default function Landing() {
    return (
        <>
            <Header />

            <main>
                <section className="hero">
                    <div className="hero-text">
                        <h1>Bienvenido a nuestra tienda de ...</h1>
                        <p>
                            INTRODUCCIÓN. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Duis finibus iaculis risus at lobortis. Nullam ut luctus massa. 
                        </p>
                        <Link to="/catalogo">
                            <button className="btn">Catálogo</button>
                        </Link>
                    </div>
                </section>

                <section className="categorias">
                    <div className="card">
                        <div className="img-placeholder"></div>
                        <h2>Productos</h2>
                    </div>
                    <div className="card">
                        <div className="img-placeholder"></div>
                        <h2>Paquetes</h2>
                    </div>
                    <div className="card">
                        <div className="img-placeholder"></div>
                        <h2>Ofertas</h2>
                    </div>
                </section>

                <section className="productos">
                    <h2>Bienvenido</h2>
                    <p>Estos son los productos recién añadidos</p>

                    <div className="productos-grid">
                        <div className="card">
                            <div className="etiqueta">NUEVO</div>
                            <div className="img-placeholder"></div>
                            <h3>PRODUCTO</h3>
                            <p>DESCRIPCIÓN. Lorem ipsum dolor sit amet...</p>
                            <button className="btn">Añadir al carro</button>
                        </div>

                        <div className="card">
                            <div className="img-placeholder"></div>
                            <h3>PRODUCTO</h3>
                            <p>DESCRIPCIÓN. Lorem ipsum dolor sit amet...</p>
                            <button className="btn">Añadir al carro</button>
                        </div>

                        <div className="card">
                            <div className="etiqueta descuento">-50%</div>
                            <div className="img-placeholder"></div>
                            <h3>PRODUCTO</h3>
                            <p>DESCRIPCIÓN. Lorem ipsum dolor sit amet...</p>
                            <button className="btn">Añadir al carro</button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

