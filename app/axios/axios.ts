import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true, // This is crucial for cookie-based auth
});

// Request interceptor (simplified for cookie-based auth)
axiosInstance.interceptors.request.use(
  (config) => {
    // No need to manually set Authorization header
    // Cookies will be sent automatically with withCredentials: true
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.response.data?.message === "Unauthenticated.") {
        // For cookie-based auth, you might want to call a logout endpoint
        // to clear the httpOnly cookie, or just redirect
        window.location.href = "/auth/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
