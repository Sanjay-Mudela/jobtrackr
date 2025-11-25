import axios from "axios";

// ✅ IMPORTANT:
// Set this in your .env file as: VITE_API_URL="https://your-render-backend.onrender.com/api"
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// If VITE_API_URL is missing, log it to help debugging
if (!import.meta.env.VITE_API_URL) {
  console.warn(
    "VITE_API_URL is not set. API requests will fail. Set it in your .env and Vercel env."
  );
}

// 🔹 Attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jobtrackr_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid / expired -> clear and (optionally) redirect
      localStorage.removeItem("jobtrackr_user");
      localStorage.removeItem("jobtrackr_token");

      // Avoid infinite loops: only redirect if not already on /login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?reason=session-expired";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
