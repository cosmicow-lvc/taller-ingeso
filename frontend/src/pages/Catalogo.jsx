import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/estilo.css";
import ProductDetail from "../components/ProductDetail";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Catalogo() {
  // ===== Drawer móvil =====
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const handleCloseFilters = () => setMobileFiltersOpen(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const handler = (e) => { if (e.matches) handleCloseFilters(); };
    if (mq.matches) handleCloseFilters();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleCloseFilters(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFiltersOpen]);

  // ===== Filtros =====
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [q, setQ] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("featured");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [open, setOpen] = useState({ category:true, price:false, q:false, brand:false, rating:false });
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const gridMessageStyle = { gridColumn: "1 / -1", textAlign: "center", padding: "2rem 0" };
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync inicial desde URL y mantener en sincronía
  useEffect(() => {
    const qParam = searchParams.get("q") ?? "";
    setQ(qParam);
  }, [searchParams]);

  useEffect(() => {
    const curr = searchParams.get("q") ?? "";
    if ((q ?? "") !== curr) {
      const next = new URLSearchParams(searchParams);
      if (q && q.trim() !== "") next.set("q", q);
      else next.delete("q");
      setSearchParams(next, { replace: false });
    }
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts(){
      setStatus({ loading: true, error: "" });
      try {
        const response = await fetch(`${API_URL}/productos`);
        if (!response.ok) throw new Error("Error al consultar el catálogo");
        const payload = await response.json();
        if (!cancelled){
          setProducts(payload);
          setStatus({ loading: false, error: "" });
        }
      } catch (error) {
        if (!cancelled) setStatus({ loading: false, error: "No pudimos cargar el catálogo." });
      }
    }
    loadProducts();
    return () => { cancelled = true; };
  }, []);

  const { loading, error } = status;

  const brands = useMemo(() => {
    const values = products.map((p) => p.brand).filter(Boolean);
    return [...new Set(values)].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [products]);

  const categories = useMemo(() => {
    const values = products.map((p) => p.category).filter(Boolean);
    return [...new Set(values)].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [products]);

  const filtered = useMemo(() => {
    const min = minPrice ?? -Infinity;
    const max = maxPrice ?? Infinity;
    const list = products.filter(p => {
      if (selectedCategories.size && !selectedCategories.has(p.category)) return false;
      if (selectedBrands.size && !selectedBrands.has(p.brand)) return false;
      if (p.price < min || p.price > max) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (rating && p.rating < Number(rating)) return false;
      return true;
    });
    const byName = (a,b)=>a.name.localeCompare(b.name,"es",{sensitivity:"base"});
    const byPrice = (a,b)=>a.price-b.price;
    const byRating=(a,b)=>b.rating-a.rating;
    if (sort==="price-asc") return list.sort(byPrice);
    if (sort==="price-desc") return list.sort((a,b)=>byPrice(b,a));
    if (sort==="name-asc") return list.sort(byName);
    if (sort==="name-desc") return list.sort((a,b)=>byName(b,a));
    return list.sort(byRating);
  }, [products, selectedCategories,selectedBrands,minPrice,maxPrice,q,rating,sort]);

  // ===== Chips (eliminar filtros) =====
  const chips = useMemo(() => {
    const out = [];
    if (selectedCategories.size) {
      [...selectedCategories].forEach(v => out.push({ key: "category", label: `Cat: ${v}`, value: v }));
    }
    if (selectedBrands.size) {
      [...selectedBrands].forEach(v => out.push({ key: "brand", label: `Marca: ${v}`, value: v }));
    }
    if (minPrice !== null || maxPrice !== null) {
      out.push({ key: "price", label: `Precio: ${minPrice ?? "-"} – ${maxPrice ?? "-"}`, value: "price" });
    }
    if (q) out.push({ key: "q", label: `Buscar: ${q}`, value: "q" });
    if (rating) out.push({ key: "rating", label: `${rating}★+`, value: "rating" });
    return out;
  }, [selectedCategories, selectedBrands, minPrice, maxPrice, q, rating]);

  function removeFilter(chip){
    if (chip.key === "category"){
      setSelectedCategories(prev => { const next = new Set(prev); next.delete(chip.value); return next; });
    } else if (chip.key === "brand"){
      setSelectedBrands(prev => { const next = new Set(prev); next.delete(chip.value); return next; });
    } else if (chip.key === "price"){
      setMinPrice(null); setMaxPrice(null); setMinPriceInput(""); setMaxPriceInput("");
    } else if (chip.key === "q"){
      setQ("");
    } else if (chip.key === "rating"){
      setRating("");
    }
  }

  function clearAll(){
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setQ("");
    setRating("");
    setMinPrice(null); setMaxPrice(null);
    setMinPriceInput(""); setMaxPriceInput("");
  }

  // ===== Detalle =====
  const [detailProduct, setDetailProduct] = useState(null);
  const { addItem } = useCart();

  function toggleSet(setter, value){
    setter(prev => { const next = new Set(prev); if (next.has(value)) next.delete(value); else next.add(value); return next; });
  }

  // ======= UI =======
  return (
    <div>
      <Header />
      <div className="layout">
        <h1 className="page-title">Catálogo</h1>

        <div className="toolbar">
          {/* BÚSQUEDA SUPERIOR SINCRONIZADA CON NAVBAR */}
          <input
            className="search-in-filter"
            type="search"
            placeholder="Buscar producto…"
            value={q}
            onChange={(e)=>setQ(e.target.value.trimStart())}
            aria-label="Buscar producto"
            style={{ maxWidth: 280, marginRight: 12 }}
          />
          <button className="filter-toggle" onClick={()=>setMobileFiltersOpen(true)} aria-controls="filtersDrawer" aria-expanded={mobileFiltersOpen}>☰ Filtros</button>

          {/* CHIPS DE FILTROS ACTIVOS */}
          <div className="chips" aria-live="polite" style={{flex:1}}>
            {chips.map((c, idx) => (
              <button key={idx} className="chip" onClick={() => removeFilter(c)}>
                {c.label} <span className="x">✕</span>
              </button>
            ))}
            {chips.length>0 && (
              <button className="chip" onClick={clearAll} title="Limpiar todos los filtros">
                Limpiar filtros <span className="x">✕</span>
              </button>
            )}
          </div>

          <div className="sort">
            <select aria-label="Ordenar por" value={sort} onChange={(e)=>setSort(e.target.value)}>
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
            </select>
          </div>
        </div>

        <div className={`backdrop ${mobileFiltersOpen ? "show" : ""}`} onClick={handleCloseFilters} aria-hidden={!mobileFiltersOpen}/>

        <div className="content">
          <aside id="filtersDrawer" className={`sidebar ${mobileFiltersOpen ? "open" : ""}`} aria-label="Filtros del catálogo" role="dialog" aria-modal="true">
            <div className="filter-header header-with-close">
              <span>Filtros</span>
              <button type="button" className="close-sidebar" onClick={handleCloseFilters} aria-label="Cerrar filtros" title="Cerrar">✕</button>
            </div>

            <div className="accordion">
              <section className={`acc-item ${open.category ? "open":""}`}>
                <button className="acc-button" type="button" aria-expanded={open.category} onClick={()=>setOpen(o=>({...o,category:!o.category}))}>
                  <span>Categoría</span><span>{open.category?"▾":"▸"}</span>
                </button>
                <div className="acc-content">
                  <div>
                    {(categories.length ? categories : ["CAT 1","CAT 2","Accesorios"]).map(c=>{
                      const id=`cat-${c}`;
                      return (
                        <div className="check" key={c}>
                          <input type="checkbox" id={id} checked={selectedCategories.has(c)} onChange={()=>toggleSet(setSelectedCategories,c)} />
                          <label htmlFor={id}>{c}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className={`acc-item ${open.price ? "open":""}`}>
                <button className="acc-button" type="button" aria-expanded={open.price} onClick={()=>setOpen(o=>({...o,price:!o.price}))}>
                  <span>Precio</span><span>{open.price?"▾":"▸"}</span>
                </button>
                <div className="acc-content">
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <input className="search-in-filter" type="number" min="0" placeholder="Mín" style={{maxWidth:110}} value={minPriceInput} onChange={(e)=>setMinPriceInput(e.target.value)} />
                    <input className="search-in-filter" type="number" min="0" placeholder="Máx" style={{maxWidth:110}} value={maxPriceInput} onChange={(e)=>setMaxPriceInput(e.target.value)} />
                    <button className="btn" onClick={()=>{
                      const mn=Number(minPriceInput), mx=Number(maxPriceInput);
                      setMinPrice(isNaN(mn)||minPriceInput.trim()===""?null:mn);
                      setMaxPrice(isNaN(mx)||maxPriceInput.trim()===""?null:mx);
                    }}>Aplicar</button>
                  </div>
                </div>
              </section>

              <section className={`acc-item ${open.q ? "open":""}`}>
                <button className="acc-button" type="button" aria-expanded={open.q} onClick={()=>setOpen(o=>({...o,q:!o.q}))}>
                  <span>Buscar</span><span>{open.q?"▾":"▸"}</span>
                </button>
                <div className="acc-content">
                  <div>
                    <input className="search-in-filter" type="search" placeholder="Nombre del producto…" value={q} onChange={(e)=>setQ(e.target.value.trimStart())} />
                  </div>
                </div>
              </section>

              <section className={`acc-item ${open.brand ? "open":""}`}>
                <button className="acc-button" type="button" aria-expanded={open.brand} onClick={()=>setOpen(o=>({...o,brand:!o.brand}))}>
                  <span>Marca</span><span>{open.brand?"▾":"▸"}</span>
                </button>
                <div className="acc-content">
                  <div id="brandList">
                    {brands.map(b=>{
                      const id=`b-${b}`;
                      return (
                        <div className="check" key={b}>
                          <input type="checkbox" id={id} checked={selectedBrands.has(b)} onChange={()=>toggleSet(setSelectedBrands,b)} />
                          <label htmlFor={id}>{b}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className={`acc-item ${open.rating ? "open":""}`}>
                <button className="acc-button" type="button" aria-expanded={open.rating} onClick={()=>setOpen(o=>({...o,rating:!o.rating}))}>
                  <span>Rating</span><span>{open.rating?"▾":"▸"}</span>
                </button>
                <div className="acc-content">
                  <div>
                    <div className="check"><input type="radio" name="rating" id="r4" checked={rating==="4"} onChange={()=>setRating("4")} /><label htmlFor="r4">4★ o más</label></div>
                    <div className="check"><input type="radio" name="rating" id="r3" checked={rating==="3"} onChange={()=>setRating("3")} /><label htmlFor="r3">3★ o más</label></div>
                    <div className="check"><input type="radio" name="rating" id="r2" checked={rating==="2"} onChange={()=>setRating("2")} /><label htmlFor="r2">2★ o más</label></div>
                    <div className="check"><input type="radio" name="rating" id="rall" checked={rating===""} onChange={()=>setRating("")} /><label htmlFor="rall">Todos</label></div>
                  </div>
                </div>
              </section>
            </div>
          </aside>

          {/* Grid */}
          <main>
            <div id="grid" className="grid" aria-live="polite">
              {loading && (
                <div className="grid-message" role="status" style={gridMessageStyle}>
                  Cargando catálogo…
                </div>
              )}
              {!loading && error && (
                <div className="grid-message" role="alert" style={gridMessageStyle}>
                  {error}
                </div>
              )}
              {!loading && !error && filtered.length === 0 && (
                <div className="grid-message" style={gridMessageStyle}>
                  No encontramos productos con los filtros actuales.
                </div>
              )}
              {!loading && !error && filtered.map((p) => (
                <article className="card" key={p.id}>
                  <button
                    type="button"
                    className="thumb"
                    onClick={() => setDetailProduct(p)}
                    aria-label={`Ver detalles de ${p.name}`}
                  >
                    <img src={p.image} alt={`Imagen de ${p.name}`} loading="lazy" />
                  </button>
                  <div className="card-body">
                    <div className="title" title={p.name}>{p.name}</div>
                    <div className="meta">
                      <span className="price">${p.price}</span>
                      <button className="btn primary" onClick={()=>setDetailProduct(p)}>Ver</button>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--sub)" }}>
                      {p.brand} • {p.category} • {"★".repeat(Math.round(p.rating || 0))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </div>

        {detailProduct && (
          <ProductDetail
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
            onAdd={(payload) => { addItem(payload); }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
