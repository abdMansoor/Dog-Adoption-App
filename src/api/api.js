import axios from "axios";

const api = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Add any request interceptors if necessary
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      // Unauthorized, redirect to login
      sessionStorage.removeItem("isAuthenticated");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
