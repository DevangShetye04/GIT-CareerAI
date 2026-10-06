export default function Card({ children, className = "", style = {}, padded = true }) {
  return (
    <div
      className={`rounded-2xl bg-card border border-line shadow-card ${padded ? "p-5" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
