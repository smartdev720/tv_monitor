import axiosInstance from "../axiosInstance";

export const fetchComparesBadData = async (data) => {
  const response = await axiosInstance.post("/compare/get/bad-data", data);
  return response.data;
};
