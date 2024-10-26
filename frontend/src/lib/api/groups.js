import axiosInstance from "../axiosInstance";

export const fetchAllGroups = async () => {
  const response = await axiosInstance.get("/groups/all");
  return response.data;
};

export const fetchSelectedCommands = async (data) => {
  const response = await axiosInstance.post("/groups/selected-commands", data);
  return response.data;
};

export const fetchChannelNameByGroupId = async (id) => {
  const response = await axiosInstance.get(`/groups/channel-name/${id}`);
  return response.data;
};

export const addNewGroup = async (newGroup) => {
  const response = await axiosInstance.post("/groups/add-new", newGroup);
  return response.data;
};
