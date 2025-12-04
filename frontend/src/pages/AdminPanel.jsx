import React, { useEffect, useState } from "react";

export default function AdminPanel() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsultas();
  }, []);

  async function fetchConsultas() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/consultas");
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setConsultas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResponder(id) {
    const respuesta = prompt("Ingrese la respuesta para la consulta:");
    if (!respuesta) return;
    try {
      const res = await fetch(`http://localhost:3000/consultas/${id}/responder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuesta }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchConsultas();
      alert("Respuesta enviada");
    } catch (err) {
      alert("Error al responder: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta consulta?")) return;
    try {
      const res = await fetch(`http://localhost:3000/consultas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchConsultas();
      alert("Consulta eliminada");
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Panel de Administrador</h1>
      <p>Gestión básica de consultas recibidas desde el sitio.</p>

      {loading && <p>Cargando consultas...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Nombre</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Email</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Asunto</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Fecha</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Respondida</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((c) => (
              <tr key={c.id}>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{c.id}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{c.nombre}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{c.email}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{c.asunto}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{c.fecha_creacion}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{c.respondida ? "Sí" : "No"}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>
                  <button onClick={() => alert((c.mensaje ?? "") + (c.respuesta ? "\n\nRespuesta:\n" + c.respuesta : ""))} style={{ marginRight: 8 }}>Ver</button>
                  {!c.respondida && <button onClick={() => handleResponder(c.id)} style={{ marginRight: 8 }}>Responder</button>}
                  <button onClick={() => handleDelete(c.id)} style={{ color: "#a00" }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
