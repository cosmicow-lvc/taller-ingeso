import { useMemo, useState, useEffect } from "react";
import "./estilo.css";

const initialProducts = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  name: ["Producto", "Gadget", "Item", "Accesorio"][i % 4] + " " + (i + 1),
  price: (i % 7 + 1) * 10 + (i % 3) * 4 + 1,
  category: ["CAT 1", "CAT 2", "Accesorios"][i % 3],
  brand: ["Acme", "Nova", "Zetta", "Orion"][i % 4],
  rating: [5, 4, 4, 3, 2, 5, 3, 4, 5, 1, 4, 2, 5, 3, 4, 5][i],
}));

export default function Catalogo() {
  // Estado de filtros
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [q, setQ] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("featured");

  // Precio
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  // Acordeón
  const [open, setOpen] = useState({
    category: true,
    price: false,
    q: false,
    brand: false,
    rating: false,
  });

  // Drawer móvil
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleCloseFilters = () => setMobileFiltersOpen(false);

  // Cerrar el drawer automáticamente al pasar a desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const handler = (e) => { if (e.matches) handleCloseFilters(); };
    if (mq.matches) handleCloseFilters();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Cerrar con tecla ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleCloseFilters(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Bloquear scroll del body cuando el drawer está abierto (móvil)
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFiltersOpen]);

  const brands = useMemo(
    () => [...new Set(initialProducts.map((p) => p.brand))].sort(),
    []
  );

  // Filtrado + ordenamiento
  const filtered = useMemo(() => {
    const min = minPrice ?? -Infinity;
    const max = maxPrice ?? Infinity;

    const list = initialProducts.filter((p) => {
      if (selectedCategories.size && !selectedCategories.has(p.category)) return false;
      if (selectedBrands.size && !selectedBrands.has(p.brand)) return false;
      if (p.price < min || p.price > max) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (rating && p.rating < Number(rating)) return false;
      return true;
    });

    const byName = (a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" });
    const byPrice = (a, b) => a.price - b.price;
    const byRating = (a, b) => b.rating - a.rating;

    if (sort === "price-asc") return list.sort(byPrice);
    if (sort === "price-desc") return list.sort((a, b) => byPrice(b, a));
    if (sort === "name-asc") return list.sort(byName);
    if (sort === "name-desc") return list.sort((a, b) => byName(b, a));
    return list.sort(byRating); // destacados
  }, [selectedCategories, selectedBrands, minPrice, maxPrice, q, rating, sort]);

  // Chips activos
  const chips = useMemo(() => {
    const out = [];
    if (selectedCategories.size) {
      [...selectedCategories].forEach((v) => out.push({ key: "category", label: `Cat: ${v}`, value: v }));
    }
    if (selectedBrands.size) {
      [...selectedBrands].forEach((v) => out.push({ key: "brand", label: `Marca: ${v}`, value: v }));
    }
    if (minPrice !== null || maxPrice !== null) {
      out.push({ key: "price", label: `Precio: ${minPrice ?? "-"} – ${maxPrice ?? "-"}`, value: "price" });
    }
    if (q) out.push({ key: "q", label: `Buscar: ${q}`, value: "q" });
    if (rating) out.push({ key: "rating", label: `${rating}★+`, value: "rating" });
    return out;
  }, [selectedCategories, selectedBrands, minPrice, maxPrice, q, rating]);

  // Acciones chips
  function removeFilter(chip) {
    if (chip.key === "category") {
      setSelectedCategories((prev) => { const next = new Set(prev); next.delete(chip.value); return next; });
    } else if (chip.key === "brand") {
      setSelectedBrands((prev) => { const next = new Set(prev); next.delete(chip.value); return next; });
    } else if (chip.key === "price") {
      setMinPrice(null); setMaxPrice(null); setMinPriceInput(""); setMaxPriceInput("");
    } else if (chip.key === "q") {
      setQ("");
    } else if (chip.key === "rating") {
      setRating("");
    }
  }

  // Toggle helper
  function toggleSet(setter, value) {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return (
    <div className="layout">
      <h1 className="page-title">Catálogo</h1>

      {/* Toolbar */}
      <div className="toolbar">
        <button
          className="filter-toggle"
          onClick={() => setMobileFiltersOpen(true)}
          aria-controls="filtersDrawer"
          aria-expanded={mobileFiltersOpen}
        >
          ☰ Filtros
        </button>

        <div className="chips" id="activeChips" aria-live="polite">
          {chips.map((c, idx) => (
            <button key={idx} className="chip" onClick={() => removeFilter(c)}>
              {c.label} <span className="x">✕</span>
            </button>
          ))}
        </div>

        <div className="sort">
          <select aria-label="Ordenar por" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
          </select>
        </div>
      </div>

      {/* Fondo del drawer */}
      <div
        className={`backdrop ${mobileFiltersOpen ? "show" : ""}`}
        onClick={handleCloseFilters}
        onTouchStart={handleCloseFilters}
        aria-hidden={!mobileFiltersOpen}
      />

      <div className="content">
        {/* Sidebar / Drawer */}
        <aside
          id="filtersDrawer"
          className={`sidebar ${mobileFiltersOpen ? "open" : ""}`}
          aria-label="Filtros del catálogo"
          role="dialog"
          aria-modal="true"
        >
          {/* Encabezado con botón cerrar dentro */}
          <div className="filter-header header-with-close">
            <span>Filtros</span>
            <button
              type="button"
              className="close-sidebar"
              onClick={handleCloseFilters}
              onTouchStart={handleCloseFilters}
              aria-label="Cerrar filtros"
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="accordion" id="filters">
            {/* Categoría */}
            <section className={`acc-item ${open.category ? "open" : ""}`} data-key="category">
              <button
                className="acc-button"
                type="button"
                aria-expanded={open.category}
                onClick={() => setOpen((o) => ({ ...o, category: !o.category }))}
              >
                <span>Categoría</span>
                <span>{open.category ? "▾" : "▸"}</span>
              </button>
              <div className="acc-content">
                <div>
                  {["CAT 1", "CAT 2", "Accesorios"].map((c) => {
                    const id = `cat-${c}`;
                    return (
                      <div className="check" key={c}>
                        <input
                          type="checkbox"
                          id={id}
                          checked={selectedCategories.has(c)}
                          onChange={() => toggleSet(setSelectedCategories, c)}
                        />
                        <label htmlFor={id}>{c}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Precio */}
            <section className={`acc-item ${open.price ? "open" : ""}`} data-key="price">
              <button
                className="acc-button"
                type="button"
                aria-expanded={open.price}
                onClick={() => setOpen((o) => ({ ...o, price: !o.price }))}
              >
                <span>Precio</span>
                <span>{open.price ? "▾" : "▸"}</span>
              </button>
              <div className="acc-content">
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      className="search-in-filter"
                      type="number"
                      min="0"
                      placeholder="Mín"
                      style={{ maxWidth: 110 }}
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                    />
                    <input
                      className="search-in-filter"
                      type="number"
                      min="0"
                      placeholder="Máx"
                      style={{ maxWidth: 110 }}
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                    />
                    <button
                      className="btn"
                      onClick={() => {
                        const mn = Number(minPriceInput);
                        const mx = Number(maxPriceInput);
                        setMinPrice(isNaN(mn) || minPriceInput.trim() === "" ? null : mn);
                        setMaxPrice(isNaN(mx) || maxPriceInput.trim() === "" ? null : mx);
                      }}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Buscar */}
            <section className={`acc-item ${open.q ? "open" : ""}`} data-key="q">
              <button
                className="acc-button"
                type="button"
                aria-expanded={open.q}
                onClick={() => setOpen((o) => ({ ...o, q: !o.q }))}
              >
                <span>Buscar</span>
                <span>{open.q ? "▾" : "▸"}</span>
              </button>
              <div className="acc-content">
                <div>
                  <input
                    className="search-in-filter"
                    type="search"
                    placeholder="Nombre del producto…"
                    value={q}
                    onChange={(e) => setQ(e.target.value.trimStart())}
                  />
                </div>
              </div>
            </section>

            {/* Marca */}
            <section className={`acc-item ${open.brand ? "open" : ""}`} data-key="brand">
              <button
                className="acc-button"
                type="button"
                aria-expanded={open.brand}
                onClick={() => setOpen((o) => ({ ...o, brand: !o.brand }))}
              >
                <span>Marca</span>
                <span>{open.brand ? "▾" : "▸"}</span>
              </button>
              <div className="acc-content">
                <div id="brandList">
                  {brands.map((b) => {
                    const id = `b-${b}`;
                    return (
                      <div className="check" key={b}>
                        <input
                          type="checkbox"
                          id={id}
                          checked={selectedBrands.has(b)}
                          onChange={() => toggleSet(setSelectedBrands, b)}
                        />
                        <label htmlFor={id}>{b}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Rating */}
            <section className={`acc-item ${open.rating ? "open" : ""}`} data-key="rating">
              <button
                className="acc-button"
                type="button"
                aria-expanded={open.rating}
                onClick={() => setOpen((o) => ({ ...o, rating: !o.rating }))}
              >
                <span>Rating</span>
                <span>{open.rating ? "▾" : "▸"}</span>
              </button>
              <div className="acc-content">
                <div>
                  <div className="check">
                    <input type="radio" name="rating" id="r4" checked={rating === "4"} onChange={() => setRating("4")} />
                    <label htmlFor="r4">4★ o más</label>
                  </div>
                  <div className="check">
                    <input type="radio" name="rating" id="r3" checked={rating === "3"} onChange={() => setRating("3")} />
                    <label htmlFor="r3">3★ o más</label>
                  </div>
                  <div className="check">
                    <input type="radio" name="rating" id="r2" checked={rating === "2"} onChange={() => setRating("2")} />
                    <label htmlFor="r2">2★ o más</label>
                  </div>
                  <div className="check">
                    <input type="radio" name="rating" id="rall" checked={rating === ""} onChange={() => setRating("")} />
                    <label htmlFor="rall">Todos</label>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </aside>

        {/* Grid */}
        <main>
          <div id="grid" className="grid" aria-live="polite">
            {filtered.map((p) => (
              <article className="card" data-id={p.id} key={p.id}>
                <div className="thumb" role="img" aria-label={`Imagen de ${p.name}`}>
                  <span>Imagen</span>
                </div>
                <div className="card-body">
                  <div className="title" title={p.name}>{p.name}</div>
                  <div className="meta">
                    <span className="price">${p.price}</span>
                    <button className="btn primary" onClick={() => alert(`Agregado: ${p.name}`)}>Agregar</button>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--sub)" }}>
                    {p.brand} • {p.category} • {"★".repeat(p.rating)}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div id="empty" className="empty" hidden={filtered.length > 0}>
            No hay productos que coincidan con los filtros.
          </div>
        </main>
      </div>
    </div>
  );
}
