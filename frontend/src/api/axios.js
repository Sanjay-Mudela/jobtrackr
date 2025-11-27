import axios from "axios";

// Prefer env, but fall back to localhost in dev
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : undefined);

if (!baseURL) {
  console.error(
    "❌ API baseURL is not configured. Set VITE_API_URL in your environment."
  );
}

const api = axios.create({
  baseURL,
});

// Attach token to every request
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

// Handle 401 globally (optional, but you had this before)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jobtrackr_user");
      localStorage.removeItem("jobtrackr_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login?reason=session-expired";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
