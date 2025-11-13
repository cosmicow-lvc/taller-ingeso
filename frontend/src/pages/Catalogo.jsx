import { useMemo, useState, useEffect } from "react";
import "../styles/estilo.css";
import ProductDetail from "../components/ProductDetail";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

// ==== Datos de ejemplo con variantes y reseñas ====
const products = [
  {
    id: 1,
    name: "Auriculares Nova X",
    description:
      "Auriculares inalámbricos con cancelación de ruido activa, 30h de batería y carga rápida.",
    brand: "Nova",
    category: "Accesorios",
    rating: 4.6,
    price: 49,
    variants: [
      { id: "negro", name: "Negro", price: 49, stock: 12, image: "" },
      { id: "blanco", name: "Blanco", price: 52, stock: 8, image: "" },
      { id: "azul", name: "Azul", price: 55, stock: 5, image: "" },
    ],
    reviews: [
      { id: "r1", user: "Ana", rating: 5, comment: "Se escuchan increíble y la batería dura mucho.", date: "2025-06-01" },
      { id: "r2", user: "Luis", rating: 4, comment: "Muy cómodos, el estuche es compacto.", date: "2025-06-18" },
    ],
  },
  {
    id: 2,
    name: "Teclado Orion K7",
    description:
      "Teclado mecánico compacto 75% con switches hot-swap y retroiluminación RGB.",
    brand: "Orion",
    category: "CAT 1",
    rating: 4.3,
    price: 79,
    variants: [
      { id: "red", name: "Switch Rojo", price: 79, stock: 6, image: "" },
      { id: "blue", name: "Switch Azul", price: 79, stock: 9, image: "" },
      { id: "brown", name: "Switch Marrón", price: 85, stock: 3, image: "" },
    ],
    reviews: [
      { id: "r3", user: "Majo", rating: 5, comment: "El tamaño es perfecto para el escritorio.", date: "2025-05-02" },
      { id: "r4", user: "Tomás", rating: 3, comment: "Buen producto, las keycaps podrían ser mejores.", date: "2025-07-10" },
    ],
  },
  {
    id: 3,
    name: "Mouse Acme Pro",
    description:
      "Mouse ergonómico de alto rendimiento con sensor 26K y 5 perfiles.",
    brand: "Acme",
    category: "CAT 2",
    rating: 4.8,
    price: 39,
    variants: [
      { id: "wired", name: "Cableado", price: 39, stock: 20, image: "" },
      { id: "wireless", name: "Inalámbrico", price: 59, stock: 7, image: "" },
    ],
    reviews: [
      { id: "r5", user: "Sofía", rating: 5, comment: "Preciso y muy cómodo, ideal para jugar.", date: "2025-04-14" },
    ],
  },
  {
    id: 4,
    name: "Monitor Zetta 27” QHD",
    description:
      "Panel IPS 27 pulgadas 2560×1440 a 165Hz con FreeSync y peana ajustable.",
    brand: "Zetta",
    category: "CAT 1",
    rating: 4.5,
    price: 269,
    variants: [
      { id: "165", name: "165 Hz", price: 269, stock: 4, image: "" },
      { id: "240", name: "240 Hz", price: 339, stock: 2, image: "" },
    ],
    reviews: [
      { id: "r6", user: "Pablo", rating: 5, comment: "Colores increíbles y fluidez total.", date: "2025-03-03" },
      { id: "r7", user: "Vale", rating: 4, comment: "Buen brillo; los altavoces integrados son meh.", date: "2025-06-22" },
    ],
  },
];

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

  const brands = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), []);

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
  }, [selectedCategories,selectedBrands,minPrice,maxPrice,q,rating,sort]);

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
                    {["CAT 1","CAT 2","Accesorios"].map(c=>{
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
              {filtered.map((p) => (
                <article className="card" key={p.id}>
                  <div className="thumb" role="img" aria-label={`Imagen de ${p.name}`} onClick={()=>setDetailProduct(p)} style={{cursor:"pointer"}}>
                    <span>Imagen</span>
                  </div>
                  <div className="card-body">
                    <div className="title" title={p.name}>{p.name}</div>
                    <div className="meta">
                      <span className="price">${p.price}</span>
                      <button className="btn primary" onClick={()=>setDetailProduct(p)}>Ver</button>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--sub)" }}>
                      {p.brand} • {p.category} • {"★".repeat(Math.round(p.rating))}
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
