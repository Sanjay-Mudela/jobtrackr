import axios from "axios";

// 1️⃣ Create a dedicated axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 2️⃣ Request interceptor: attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jobtrackr_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3️⃣ Response interceptor: handle 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend says: "you are not authorized" (token missing/expired/invalid)
    if (error.response?.status === 401) {
      // Clear any stored auth data
      localStorage.removeItem("jobtrackr_user");
      localStorage.removeItem("jobtrackr_token");

      // If we're not already on login, redirect with a query parameter
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?reason=session-expired";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
