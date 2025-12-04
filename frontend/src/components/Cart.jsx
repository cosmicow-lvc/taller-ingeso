import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalCount, totalPrice, open, toggle, updateQty, removeItem, clearCart, closeCart } = useCart();

  return (
    <div aria-hidden={!open} className={`cart-drawer ${open ? "open" : ""}`} style={{
      position: "fixed", top: 0, right: 0, height: "100vh", width: 360, maxWidth: "100%",
      background: "linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.6) 100%)",
      backdropFilter: "blur(30px) saturate(180%)",
      WebkitBackdropFilter: "blur(30px) saturate(180%)",
      boxShadow: "-18px 0 40px rgba(2,6,23,.12), inset 1px 0 0 rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(148, 163, 184, 0.3)",
      transform: open ? "translateX(0)" : "translateX(110%)",
      transition: "transform .28s ease", zIndex: 1200, padding: 16, display: "flex", flexDirection: "column"
    }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between", marginBottom:12}}>
        <strong style={{color: "#ffffff", textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"}}>Carrito</strong>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <small style={{color: "#e2e8f0"}}>{totalCount} Articulos</small>
          <button onClick={toggle} aria-label="Cerrar" className="btn" style={{color: "#ffffff"}}>✕</button>
        </div>
      </div>

      <div style={{flex:1, overflowY:"auto"}}>
        {items.length === 0 && <div style={{padding:24,color:"#cbd5e1"}}>Tu carrito está vacío.</div>}
        {items.map(it => (
          <div key={`${it.productId}:${it.variantId ?? "d"}`} style={{display:"flex",gap:12, padding:"10px 0", borderBottom:"1px solid rgba(148, 163, 184, 0.2)"}}>
            <div style={{width:64,height:64,background:"rgba(100, 100, 150, 0.2)",borderRadius:8,display:"grid",placeItems:"center",overflow:"hidden"}}>
              {it.meta?.image ? (
                <img src={it.meta.image} alt={it.name} style={{width:"100%",height:"100%",objectFit:"contain",display:"block"}} onError={(e)=>{e.target.style.display='none';}} />
              ) : (
                <span style={{color: "#cbd5e1"}}>Img</span>
              )}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700, color: "#ffffff", textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"}}>{it.name}</div>
              <div style={{fontSize:13,color:"#cbd5e1"}}>{it.meta?.subtitle ?? ""}</div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginTop:8}}>
                <button className="btn" onClick={() => updateQty(it.productId, it.variantId, it.qty - 1)}>-</button>
                <div style={{minWidth:28,textAlign:"center", color: "#e2e8f0"}}>{it.qty}</div>
                <button className="btn" onClick={() => updateQty(it.productId, it.variantId, it.qty + 1)}>+</button>
                <div style={{marginLeft:"auto", fontWeight:800, color: "#ffffff", textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"}}>${(it.price * it.qty).toFixed(2)}</div>
              </div>
              <div style={{marginTop:6}}>
                <button className="btn" onClick={() => removeItem(it.productId, it.variantId)} style={{fontSize:12, color: "#cbd5e1"}}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:12}}>
        <div style={{display:"flex",justifyContent:"space-between", fontWeight:800, marginBottom:8, color: "#ffffff", textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"}}>
          <div>Total</div>
          <div>${totalPrice.toFixed(2)}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn" onClick={() => { clearCart(); closeCart(); }} style={{color: "#e2e8f0"}}>Vaciar</button>
          <button className="btn" style={{marginLeft:"auto", color: "#e2e8f0"}} onClick={() => { closeCart(); navigate("/checkout"); }}>Pagar</button>
        </div>
      </div>
    </div>
  );
}
