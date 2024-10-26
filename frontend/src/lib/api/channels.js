import axiosInstance from "../axiosInstance";

export const fetchAllChannels = async () => {
  const response = await axiosInstance.get("/channels/all");
  return response.data;
};
