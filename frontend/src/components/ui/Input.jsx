export default function Input({ className = "", ...props }) {
  // Reuse your existing .input-field styles and allow extra classes
  const base = "input-field";

  return <input className={`${base} ${className}`} {...props} />;
}
