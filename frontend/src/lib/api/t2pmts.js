import axiosInstance from "../axiosInstance";

export const fetchT2PmtsBySettingIdBeforeDate = async (data) => {
  const response = await axiosInstance.post("/t2pmts/get-before-date", data);
  return response.data;
};

export const updateT2PmtsUnderControlById = async (data) => {
  const response = await axiosInstance.patch(
    "/t2pmts/update-under-control",
    data
  );
  return response.data;
};
