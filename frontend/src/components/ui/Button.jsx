export default function Button({
  children,
  variant = "primary", // "primary" | "secondary" | "danger" | "ghost"
  size = "md",         // "md" | "sm"
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
    ghost:
      "bg-transparent text-slate-200 hover:bg-slate-800/60 border border-slate-700",
  };

  const sizes = {
    md: "px-4 py-2 text-sm",
    sm: "px-2 py-1 text-xs",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className} active:scale-95`}
      {...props}
    >
      {children}
    </button>
  );
}
