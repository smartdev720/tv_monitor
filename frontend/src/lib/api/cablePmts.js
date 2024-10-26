import axiosInstance from "../axiosInstance";

export const updateCablePmtsUnderControlById = async (data) => {
  const response = await axiosInstance.patch(
    "/cablePmts/update-under-control",
    data
  );
  return response.data;
};
