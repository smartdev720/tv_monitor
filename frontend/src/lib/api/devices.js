import axiosInstance from "../axiosInstance";
import axios from "axios";

export const fetchAllDevices = async () => {
  const response = await axios.get("http://localhost:5000/api/devices/all");
  return response.data;
};

export const fetchDevicesById = async (locations) => {
  const response = await axiosInstance.post("/devices/get-by-id", locations);
  return response.data;
};

export const updateDevice = async (data) => {
  const response = await axiosInstance.patch("/devices/update-one", data);
  return response.data;
};
