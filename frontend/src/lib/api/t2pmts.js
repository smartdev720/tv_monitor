import axiosInstance from "../axiosInstance";

export const updateT2PmtsUnderControlById = async (data) => {
  const response = await axiosInstance.patch(
    "/t2pmts/update-under-control",
    data
  );
  return response.data;
};
