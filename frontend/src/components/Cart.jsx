import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalCount, totalPrice, open, toggle, updateQty, removeItem, clearCart, closeCart } = useCart();

  return (
    <div aria-hidden={!open} className={`cart-drawer ${open ? "open" : ""}`} style={{
      position: "fixed", top: 0, right: 0, height: "100vh", width: 360, maxWidth: "100%",
      background: "#fff", boxShadow: "-18px 0 40px rgba(2,6,23,.12)", transform: open ? "translateX(0)" : "translateX(110%)",
      transition: "transform .28s ease", zIndex: 1200, padding: 16, display: "flex", flexDirection: "column"
    }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between", marginBottom:12}}>
        <strong>Carrito</strong>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <small>{totalCount} Articulos</small>
          <button onClick={toggle} aria-label="Cerrar" className="btn">✕</button>
        </div>
      </div>

      <div style={{flex:1, overflowY:"auto"}}>
        {items.length === 0 && <div style={{padding:24,color:"#666"}}>Tu carrito está vacío.</div>}
        {items.map(it => (
          <div key={`${it.productId}:${it.variantId ?? "d"}`} style={{display:"flex",gap:12, padding:"10px 0", borderBottom:"1px solid #eee"}}>
            <div style={{width:64,height:64,background:"#f4f4f4",borderRadius:8,display:"grid",placeItems:"center"}}>Img</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{it.name}</div>
              <div style={{fontSize:13,color:"#666"}}>{it.meta?.subtitle ?? ""}</div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginTop:8}}>
                <button className="btn" onClick={() => updateQty(it.productId, it.variantId, it.qty - 1)}>-</button>
                <div style={{minWidth:28,textAlign:"center"}}>{it.qty}</div>
                <button className="btn" onClick={() => updateQty(it.productId, it.variantId, it.qty + 1)}>+</button>
                <div style={{marginLeft:"auto", fontWeight:800}}>${(it.price * it.qty).toFixed(2)}</div>
              </div>
              <div style={{marginTop:6}}>
                <button className="btn" onClick={() => removeItem(it.productId, it.variantId)} style={{fontSize:12}}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:12}}>
        <div style={{display:"flex",justifyContent:"space-between", fontWeight:800, marginBottom:8}}>
          <div>Total</div>
          <div>${totalPrice.toFixed(2)}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn" onClick={() => { clearCart(); closeCart(); }}>Vaciar</button>
          <button className="btn" style={{marginLeft:"auto"}} onClick={() => alert("Checkout (simulado)")}>Pagar</button>
        </div>
      </div>
    </div>
  );
}
