import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toast={toast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

function Toast({ toast }) {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`max-w-xs px-4 py-3 rounded-lg shadow-lg border text-sm ${
          isError
            ? "bg-rose-900/80 border-rose-700 text-rose-50"
            : "bg-emerald-900/80 border-emerald-700 text-emerald-50"
        }`}
      >
        {toast.message}
      </div>
    </div>
  );
}
