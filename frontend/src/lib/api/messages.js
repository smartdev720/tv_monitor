import axiosInstance from "../axiosInstance";

export const fetchNewMessageByUserId = async (userId) => {
  const response = await axiosInstance.get(`/message/get/${userId}`);
  return response.data;
};

export const updateCheckedMessageById = async (data) => {
  const response = await axiosInstance.patch("/message/checked", data);
  return response.data;
};
