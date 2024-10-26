import axiosInstance from "../axiosInstance";

export const fetchAllDevices = async () => {
  const response = await axiosInstance.get("/devices/all");
  return response.data;
};

export const updateDevice = async (data) => {
  const response = await axiosInstance.patch("/devices/update-one", data);
  return response.data;
};
