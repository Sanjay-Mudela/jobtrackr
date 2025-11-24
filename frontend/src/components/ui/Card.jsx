export default function Card({ className = "", children, ...props }) {
  const base =
    "rounded-xl border border-slate-800 bg-slate-900/70 shadow-sm";

  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}
