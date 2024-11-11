import axiosInstance from "../axiosInstance";

export const fetchCablePmtsBySettingIdBeforeDate = async (data) => {
  const response = await axiosInstance.post("/cablePmts/get-before-date", data);
  return response.data;
};

export const updateCablePmtsUnderControlById = async (data) => {
  const response = await axiosInstance.patch(
    "/cablePmts/update-under-control",
    data
  );
  return response.data;
};
