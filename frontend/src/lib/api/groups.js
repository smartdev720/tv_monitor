import axiosInstance from "../axiosInstance";

export const fetchAllGroups = async () => {
  const response = await axiosInstance.get("/groups/all");
  return response.data;
};

export const fetchSelectedCommands = async (data) => {
  const response = await axiosInstance.post("/groups/selected-commands", data);
  return response.data;
};
