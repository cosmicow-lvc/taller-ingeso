import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/user.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: ""
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Obtener usuario del localStorage
    const usuarioGuardado = localStorage.getItem("usuario");
    
    if (!usuarioGuardado) {
      // Si no hay usuario, redirigir al login
      navigate("/login");
      return;
    }
    
    try {
      const usuarioData = JSON.parse(usuarioGuardado);
      setUser(usuarioData);
      setEditForm({
        nombre: usuarioData.nombre || "",
        apellido: usuarioData.apellido || "",
        email: usuarioData.email || "",
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: ""
      });
    } catch (error) {
      console.error("Error al parsear usuario:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setErrors({});
    setSuccessMessage("");
    // Resetear formulario al cancelar
    if (isEditing) {
      setEditForm({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: ""
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editForm.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!editForm.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      newErrors.email = "El formato del email no es válido";
    }

    // Validar contraseñas si se quiere cambiar
    if (editForm.passwordNueva || editForm.passwordConfirmar) {
      if (!editForm.passwordActual) {
        newErrors.passwordActual = "Ingresa tu contraseña actual";
      }

      if (!editForm.passwordNueva) {
        newErrors.passwordNueva = "Ingresa la nueva contraseña";
      } else if (editForm.passwordNueva.length < 8) {
        newErrors.passwordNueva = "La contraseña debe tener al menos 8 caracteres";
      }

      if (editForm.passwordNueva !== editForm.passwordConfirmar) {
        newErrors.passwordConfirmar = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const requestBody = {
        nombre: editForm.nombre,
        apellido: editForm.apellido,
        email: editForm.email
      };

      // Solo incluir contraseñas si se están cambiando
      if (editForm.passwordNueva) {
        requestBody.passwordActual = editForm.passwordActual;
        requestBody.passwordNueva = editForm.passwordNueva;
      }

      const response = await fetch(`http://localhost:3000/auth/usuario/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setUser(data.usuario);
        setSuccessMessage("Perfil actualizado exitosamente");
        setIsEditing(false);
        // Limpiar campos de contraseña
        setEditForm(prev => ({
          ...prev,
          passwordActual: "",
          passwordNueva: "",
          passwordConfirmar: ""
        }));
      } else {
        setErrors({ server: data.error || "Error al actualizar el perfil" });
      }
    } catch (error) {
      setErrors({ server: "Error de conexión con el servidor" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="user-page">
        <Header />
        <main className="container">
          <p>Cargando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Formatear fecha de registro
  const fechaRegistro = user.fecha_registro 
    ? new Date(user.fecha_registro).toLocaleDateString('es-ES')
    : 'N/A';

  return (
    <div className="user-page">
      <Header />

      <main className="container">
        <Link to="/" className="volver">← Volver</Link>

        <div className="perfil-box">
          <div className="avatar" aria-hidden="true">
            {user.nombre?.[0]?.toUpperCase() ?? "U"}
          </div>

          <h2>Perfil de Usuario</h2>

          {successMessage && (
            <div className="mensaje-exito">
              {successMessage}
            </div>
          )}

          {errors.server && (
            <div className="mensaje-error">
              {errors.server}
            </div>
          )}

          {!isEditing ? (
            // Modo Vista
            <>
              <div className="info-usuario">
                <div className="info-item">
                  <strong>Nombre:</strong>
                  <span>{user.nombre}</span>
                </div>

                <div className="info-item">
                  <strong>Apellido:</strong>
                  <span>{user.apellido || "No especificado"}</span>
                </div>

                <div className="info-item">
                  <strong>Email:</strong>
                  <span>{user.email}</span>
                </div>

                <div className="info-item">
                  <strong>Fecha de registro:</strong>
                  <span>{fechaRegistro}</span>
                </div>

                <div className="info-item">
                  <strong>Contraseña:</strong>
                  <span>********</span>
                </div>
              </div>

              <div className="botones-perfil">
                <button 
                  onClick={handleEditToggle}
                  className="btn-editar"
                >
                  Editar Perfil
                </button>
                
                <button 
                  onClick={handleCerrarSesion}
                  className="btn-cerrar-sesion"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            // Modo Edición
            <form onSubmit={handleSaveChanges} className="form-editar">
              <div className="form-group-edit">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={editForm.nombre}
                  onChange={handleInputChange}
                  className="input-principal"
                  placeholder="Tu nombre"
                />
                {errors.nombre && <span className="error-text">{errors.nombre}</span>}
              </div>

              <div className="form-group-edit">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={editForm.apellido}
                  onChange={handleInputChange}
                  className="input-principal"
                  placeholder="Tu apellido"
                />
              </div>

              <div className="form-group-edit">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="input-principal"
                  placeholder="tu@email.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="separador-password">
                <h3>Cambiar Contraseña (opcional)</h3>
              </div>

              <div className="form-group-edit">
                <label htmlFor="passwordActual">Contraseña Actual</label>
                <input
                  type="password"
                  id="passwordActual"
                  name="passwordActual"
                  value={editForm.passwordActual}
                  onChange={handleInputChange}
                  className="input-principal"
                  placeholder="Tu contraseña actual"
                />
                {errors.passwordActual && <span className="error-text">{errors.passwordActual}</span>}
              </div>

              <div className="form-group-edit">
                <label htmlFor="passwordNueva">Nueva Contraseña</label>
                <input
                  type="password"
                  id="passwordNueva"
                  name="passwordNueva"
                  value={editForm.passwordNueva}
                  onChange={handleInputChange}
                  className="input-principal"
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.passwordNueva && <span className="error-text">{errors.passwordNueva}</span>}
              </div>

              <div className="form-group-edit">
                <label htmlFor="passwordConfirmar">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  id="passwordConfirmar"
                  name="passwordConfirmar"
                  value={editForm.passwordConfirmar}
                  onChange={handleInputChange}
                  className="input-principal"
                  placeholder="Repite la nueva contraseña"
                />
                {errors.passwordConfirmar && <span className="error-text">{errors.passwordConfirmar}</span>}
              </div>

              <div className="botones-perfil">
                <button 
                  type="submit"
                  className="btn-guardar"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
                
                <button 
                  type="button"
                  onClick={handleEditToggle}
                  className="btn-cancelar"
                  disabled={saving}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}