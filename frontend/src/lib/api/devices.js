import axiosInstance from "../axiosInstance";

export const fetchAllDevices = async () => {
  const response = await axiosInstance.get("/devices/all");
  return response.data;
};
