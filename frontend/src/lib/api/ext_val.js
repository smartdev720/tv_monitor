import axiosInstance from "../axiosInstance";

export const updateExtVal = async (data) => {
  const response = await axiosInstance.patch("/ext-val/update", data);
  return response.data;
};

export const updateExtGroupVal = async (data) => {
  const response = await axiosInstance.patch("/ext-val/update/group", data);
  return response.data;
};
