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

export const fetchDat99ByGroupIdAndDate = async (data) => {
  const response = await axiosInstance.post("/groups/get/dat99", data);
  return response.data;
};

export const fetchDat99ResByCnt = async (cnt) => {
  const response = await axiosInstance.get(`/groups/get/dat99-res/${cnt}`);
  return response.data;
};

export const fetchGroupByBadDataCnt = async (cnt) => {
  const response = await axiosInstance.get(`/groups/get/bad-data/${cnt}`);
  return response.data;
};

export const getFileNamesFromBackend = async (cnt, deviceId) => {
  const response = await axiosInstance.get(`/files/${cnt}/${deviceId}`);
  return response.data;
};

export const addNewGroup = async (newGroup) => {
  const response = await axiosInstance.post("/groups/add-new", newGroup);
  return response.data;
};

export const deleteGroup = async (id) => {
  const response = await axiosInstance.delete(`/groups/delete-one/${id}`);
  return response.data;
};

export const updateCommandList = async (data) => {
  const response = await axiosInstance.patch(
    "/groups/update-commandList",
    data
  );
  return response.data;
};

export const updateExt = async (data) => {
  const response = await axiosInstance.patch("/groups/update/ext", data);
  return response.data;
};
