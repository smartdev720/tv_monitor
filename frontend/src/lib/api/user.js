import axiosInstance from "../axiosInstance";

export const login = async (user) => {
  const response = await axiosInstance.post("/auth/user-login", user);
  return response.data;
};

export const userRegister = async (user) => {
  const response = await axiosInstance.post("/auth/user-register", user);
  return response.data;
};

export const fetchUserById = async (id) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};
