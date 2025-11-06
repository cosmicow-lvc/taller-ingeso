import { useEffect, useMemo, useState } from "react";
import StarRating from "./components-StarRating.jsx";

export default function ProductDetail({ product, onClose, onAdd }){
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [qty, setQty] = useState(1);

  const variant = useMemo(
    () => product.variants.find(v => v.id === variantId) || product.variants[0],
    [product, variantId]
  );

  useEffect(()=>{
    const onKey = (e)=>{ if(e.key==="Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function add(){
    if (!variant) return;
    onAdd?.({
      productId: product.id,
      variantId: variant.id,
      qty: qty,
      price: variant.price,
    });
    onClose?.();
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Detalle de ${product.name}`}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" role="document">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="modal-header">
          <h2>{product.name}</h2>
          <StarRating value={product.rating} showValue />
        </div>

        <div className="modal-body">
          <div className="modal-media">
            <div className="modal-image" aria-label={`Imagen ${variant?.name || ""}`}>
              Imagen
            </div>
          </div>

          <div className="modal-info">
            <p className="modal-description">{product.description}</p>

            <div className="variant-block">
              <div className="variant-title">Variantes</div>
              <div className="variant-pills" role="radiogroup" aria-label="Variantes del producto">
                {product.variants.map(v => (
                  <label key={v.id} className={`pill ${variantId===v.id?"active":""}`}>
                    <input
                      type="radio"
                      name="variant"
                      value={v.id}
                      checked={variantId===v.id}
                      onChange={()=>setVariantId(v.id)}
                    />
                    {v.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="buy-row">
              <div className="price-lg">${variant?.price ?? product.price}</div>
              <div className="qty">
                <button onClick={()=>setQty(q=>Math.max(1, q-1))} aria-label="Quitar uno">−</button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e)=>setQty(Math.max(1, Number(e.target.value)||1))}
                />
                <button onClick={()=>setQty(q=>q+1)} aria-label="Agregar uno">+</button>
              </div>
              <button className="btn primary" onClick={add}>Añadir al carrito</button>
            </div>

            <div className="reviews">
              <div className="reviews-title">Reseñas</div>
              {product.reviews.length === 0 && <div className="review empty">Aún sin reseñas.</div>}
              {product.reviews.map(r => (
                <div key={r.id} className="review">
                  <div className="r-head">
                    <strong>{r.user}</strong>
                    <StarRating value={r.rating} size="sm" />
                  </div>
                  <div className="r-body">{r.comment}</div>
                  <div className="r-date">{r.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
