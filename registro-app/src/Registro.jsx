import { useState } from "react";
import "./registro.css";

export default function Registro(){
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    pass: "",
    pass2: "",
    acepta: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [errors, setErrors] = useState({});

  function onChange(e){
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function validate(){
    const e = {};
    if(!form.nombre.trim()) e.nombre = "Ingresa tu nombre";
    if(!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ingresa un correo válido";
    if(!form.pass || form.pass.length < 8) e.pass = "La contraseña debe tener 8+ caracteres";
    if(form.pass2 !== form.pass) e.pass2 = "Las contraseñas no coinciden";
    if(!form.acepta) e.acepta = "Debes aceptar los términos";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev){
    ev.preventDefault();
    if(!validate()) return;
    // Aquí iría la llamada real a tu backend.
    alert("Cuenta creada (demo).");
  }

  return (
    <div className="page">
      {/* Header simple para mantener estilo */}
      <header className="topbar">
        <nav className="nav">
          <div className="nav-left">
            <a className="nav-logo" href="#">Logo</a>
            <a href="#">Catálogo</a>
            <a href="#">Quienes somos</a>
            <a href="#">Contáctanos</a>
          </div>
          <div className="nav-right">
            <a href="#">Iniciar sesión</a>
            <input className="search" placeholder="Buscar Producto" />
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="auth-wrapper">
        <div className="back"><a href="javascript:history.back()">← Volver</a></div>

        <section className="auth-card" role="dialog" aria-label="Registro">
          <div className="auth-logo">Logo</div>
          <h1>Crear cuenta</h1>

          <form onSubmit={onSubmit} noValidate>
            <label className="field">
              <span>Nombre</span>
              <input name="nombre" value={form.nombre} onChange={onChange} placeholder="Tu nombre" required />
              {errors.nombre && <em className="msg">{errors.nombre}</em>}
            </label>

            <label className="field">
              <span>Apellido</span>
              <input name="apellido" value={form.apellido} onChange={onChange} placeholder="Tu apellido" />
            </label>

            <label className="field">
              <span>Correo</span>
              <input type="email" name="email" value={form.email} onChange={onChange} placeholder="tucorreo@ejemplo.com" required />
              {errors.email && <em className="msg">{errors.email}</em>}
            </label>

            <label className="field">
              <span>Contraseña</span>
              <div className="password">
                <input
                  type={showPass ? "text" : "password"}
                  name="pass"
                  value={form.pass}
                  onChange={onChange}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button className="toggle" type="button" onClick={()=>setShowPass(s=>!s)}>
                  {showPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.pass && <em className="msg">{errors.pass}</em>}
            </label>

            <label className="field">
              <span>Confirmar contraseña</span>
              <div className="password">
                <input
                  type={showPass2 ? "text" : "password"}
                  name="pass2"
                  value={form.pass2}
                  onChange={onChange}
                  placeholder="Repite la contraseña"
                  required
                />
                <button className="toggle" type="button" onClick={()=>setShowPass2(s=>!s)}>
                  {showPass2 ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.pass2 && <em className="msg">{errors.pass2}</em>}
            </label>

            <label className="check">
              <input type="checkbox" name="acepta" checked={form.acepta} onChange={onChange} />
              <span>Acepto los <a href="#">términos</a> y la <a href="#">política</a></span>
            </label>
            {errors.acepta && <em className="msg">{errors.acepta}</em>}

            <button className="btn primary" type="submit">Registrarse</button>
            <button className="btn" type="button">Ya tengo cuenta</button>
          </form>
        </section>
      </main>
	<footer className="site-footer" role="contentinfo">
  <div className="footer-wrap">
    <div className="footer-brand">
      <div className="brand">Logo</div>
      <div className="social">
        <a href="#" aria-label="red1">red1</a>
        <a href="#" aria-label="red2">red2</a>
        <a href="#" aria-label="red3">red3</a>
        <a href="#" aria-label="red4">red4</a>
      </div>
    </div>

    <div className="footer-col">
      <h4>Ubicación</h4>
      <p>Javier Díaz #6969</p>
      <h4>Horarios de atención</h4>
      <p>Lunes a sábado 06:00 – 13:00<br/>Domingo 10:00 – 18:00</p>
    </div>

    <div className="footer-col">
      <h4>Ayuda</h4>
      <a href="#">Preguntas frecuentes</a>
      <a href="#">Políticas de devolución</a>
      <a href="#">Contacto</a>
    </div>

    <div className="footer-col">
      <h4>Nosotros</h4>
      <a href="#">Quienes somos</a>
      <a href="#">Misión, visión y valores</a>
      <a href="#">Historia</a>
    </div>

    <div className="footer-col">
      <h4>Otro</h4>
      <a href="#">Lorem ipsum</a>
      <a href="#">Lorem ipsum</a>
      <a href="#">Lorem ipsum</a>
    </div>
  </div>
</footer>
    </div>
  );
}
