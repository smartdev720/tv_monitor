import axiosInstance from "../axiosInstance";

export const fetchSequence6 = async (id) => {
  const response = await axiosInstance.get(`/sequence/command6/${id}`);
  return response.data;
};

export const fetchSequence4 = async (id) => {
  const response = await axiosInstance.get(`/sequence/command4/${id}`);
  return response.data;
};

export const fetchSequence1 = async (id) => {
  const response = await axiosInstance.get(`/sequence/command1/${id}`);
  return response.data;
};

export const fetchSequence3 = async (id) => {
  const response = await axiosInstance.get(`/sequence/command3/${id}`);
  return response.data;
};

export const fetchSequence7 = async (id) => {
  const response = await axiosInstance.get(`/sequence/command7/${id}`);
  return response.data;
};

export const fetchSequence10 = async (id) => {
  const response = await axiosInstance.get(`/sequence/command10/${id}`);
  return response.data;
};

export const insertSequence = async (data) => {
  const response = await axiosInstance.post("/sequence/insert-one", data);
  return response.data;
};

export const updateSequence = async (data) => {
  const response = await axiosInstance.patch("/sequence/update-one", data);
  return response.data;
};
