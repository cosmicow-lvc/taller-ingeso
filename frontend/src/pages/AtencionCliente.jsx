import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/support-ui.css";
import "../styles/commons.css";

export default function AtencionAlCliente() {
  const navigate = useNavigate();

  const inicial = [
    { id: 1, pregunta: "¿CÓMO DEVUELVO MI PEDIDO?", status: "Respondido" },
    { id: 2, pregunta: "¿CÓMO CANCELO MI PEDIDO?", status: "Sin responder" },
    { id: 3, pregunta: "¿TIENEN ENVÍOS A REGIONES?", status: "Respondido" },
  ];

  const respuestas = {
    "¿CÓMO DEVUELVO MI PEDIDO?":
      "Puedes iniciar la devolución desde tu perfil > Pedidos > Devolver. Recibirás una etiqueta para el envío.",
    "¿CÓMO CANCELO MI PEDIDO?":
      "Ve a tu perfil > Pedidos y, si el pedido aún no ha sido enviado, pulsa Cancelar. Si ya salió, gestionaremos la devolución.",
    "¿TIENEN ENVÍOS A REGIONES?":
      "Sí, enviamos a todo el país con operadores externos. Los plazos se calculan al finalizar la compra.",
  };

  const [items, setItems] = useState(inicial);
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [openIds, setOpenIds] = useState(new Set());
  const [textareas, setTextareas] = useState({});

  const handleVolver = (e) => {
    e?.preventDefault();
    if (document.referrer) navigate(-1);
    else navigate("/");
  };

  const handleToggle = (id) => {
    const next = new Set(openIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenIds(next);
  };

  const handleSend = (id) => {
    const texto = (textareas[id] || "").trim();
    if (!texto) {
      alert("Escribe un mensaje antes de enviar.");
      return;
    }
    // Placeholder: aquí iría la petición al backend
    alert("Mensaje enviado:\n\n" + texto);
    setTextareas((s) => ({ ...s, [id]: "" }));
  };

  const handleNueva = () => {
    const texto = prompt("Escribe la pregunta:");
    if (!texto) return;
    const estados = ["Respondido", "Sin responder"];
    let estado = prompt('Estado: escribe "Respondido" o "Sin responder"', "Sin responder");
    estado = estados.includes(estado) ? estado : "Sin responder";
    const nuevo = { id: Date.now(), pregunta: texto.trim(), status: estado };
    setItems((s) => [...s, nuevo]);
    // abrir el nuevo elemento
    setOpenIds((s) => new Set(s).add(nuevo.id));
  };

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return items.filter((it) => {
      const matchesTexto = !ql || it.pregunta.toLowerCase().includes(ql);
      const matchesStatus = filtro === "Todos" || it.status === filtro;
      return matchesTexto && matchesStatus;
    });
  }, [items, q, filtro]);

  return (
    <>
      <div className="container-support" style={{ paddingBottom: 40 }}>
        <Link to="/" id="volverLink" className="volver" onClick={handleVolver}>
          ← Volver
        </Link>

        <h1>Atención al cliente</h1>

        <section className="panel" aria-label="Listado de preguntas frecuentes">
          <div className="panel__header" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              id="buscar"
              className="input"
              placeholder="Buscar pregunta…"
              aria-label="Buscar pregunta"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select id="filtro" className="select" aria-label="Filtrar por estatus" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="Respondido">Respondido</option>
              <option value="Sin responder">Sin responder</option>
            </select>

            <div className="spacer" style={{ flex: 1 }} />

            <button id="btnClearFiltro" className={"btn btn--tiny" + (filtro === "Todos" ? " hidden" : "")} title="Quitar filtro" onClick={() => setFiltro("Todos")}>
              Quitar filtro
            </button>
            <button id="btnNueva" className="btn btn--primary" onClick={handleNueva}>
              Nueva pregunta
            </button>
          </div>

          <table className="table" role="table" style={{ width: "100%", marginTop: 12 }}>
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Estatus</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="tbody">
              {filtered.map((it) => (
                <React.Fragment key={it.id}>
                  <tr data-status={it.status}>
                    <td data-col="pregunta">
                      <strong>{it.pregunta}</strong>
                    </td>
                    <td>
                      {it.status === "Respondido" ? (
                        <span className="chip chip--ok">
                          <span className="chip__dot" /> Respondido
                        </span>
                      ) : (
                        <span className="chip chip--wait">
                          <span className="chip__dot" /> Sin responder
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn"
                        aria-label="Ver más"
                        onClick={() => handleToggle(it.id)}
                        style={{ transform: openIds.has(it.id) ? "rotate(90deg)" : "none", transition: "transform .2s ease" }}
                      >
                        ›
                      </button>
                    </td>
                  </tr>

                  {openIds.has(it.id) && (
                    <tr className="row-details">
                      <td colSpan={3}>
                        <div className="answer">
                          <p>{respuestas[it.pregunta] ?? "Respuesta pendiente. Pronto la añadiremos."}</p>

                          <div style={{ marginTop: 10 }}>
                            <textarea
                              className="textarea"
                              placeholder="Escribe tu mensaje para el cliente…"
                              value={textareas[it.id] || ""}
                              onChange={(e) => setTextareas((s) => ({ ...s, [it.id]: e.target.value }))}
                            />
                            <button className="btn btn--tiny btn--right" onClick={() => handleSend(it.id)}>
                              Enviar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: 18 }}>
                    No hay resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}