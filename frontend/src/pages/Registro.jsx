import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/registro.css";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Registro(){
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  async function onSubmit(ev){
    ev.preventDefault();
    if(!validate()) return;
    
    setLoading(true);
    setErrors({});
    setSuccessMessage("");
    
    try {
      const response = await fetch("http://localhost:3000/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.pass
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo al login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrors({ server: data.error || "Error al crear la cuenta" });
      }
    } catch (error) {
      setErrors({ server: "Error de conexión con el servidor" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <Header />

      {/* Main */}
      <main className="auth-wrapper">
        <div className="back"><a href="javascript:history.back()">← Volver</a></div>

        <section className="auth-card" role="dialog" aria-label="Registro">
          <div className="auth-logo">Logo</div>
          <h1>Crear cuenta</h1>
          
          {successMessage && (
            <div style={{padding: "12px", background: "#d4edda", color: "#155724", borderRadius: "8px", marginBottom: "16px"}}>
              {successMessage}
            </div>
          )}
          
          {errors.server && (
            <div style={{padding: "12px", background: "#f8d7da", color: "#721c24", borderRadius: "8px", marginBottom: "16px"}}>
              {errors.server}
            </div>
          )}

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

            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
            <button className="btn" type="button" onClick={() => navigate("/login")}>Ya tengo cuenta</button>
          </form>
        </section>
      </main>
	<Footer />
    </div>
  );
}
