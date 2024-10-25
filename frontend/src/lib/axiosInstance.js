import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = async (token) => {
  if (token) {
    localStorage.setItem("Authorization", token);
    axiosInstance.defaults.headers.common["Authorization"] = token;
  } else {
    localStorage.removeItem("Authorization");
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
