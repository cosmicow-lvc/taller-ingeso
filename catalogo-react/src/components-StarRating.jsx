export default function StarRating({ value = 0, outOf = 5, size = "md", showValue = false }){
  const full = Math.round(value);
  const stars = Array.from({length: outOf}).map((_,i)=>(
    <span key={i} aria-hidden="true">{i < full ? "★" : "☆"}</span>
  ));
  return (
    <div className={`stars stars-${size}`} aria-label={`Calificación ${value} de ${outOf}`}>
      {stars} {showValue && <span style={{marginLeft:6, opacity:.7}}>{value.toFixed(1)}</span>}
    </div>
  );
}
