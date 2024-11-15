import axiosInstance from "../axiosInstance";

export const fetchT2SettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(`/t2settings/deviceId/${deviceId}`);
  return response.data;
};

export const fetchOnlyT2SettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(
    `/t2settings/get/deviceId/${deviceId}`
  );
  return response.data;
};

export const fetchT2ChartDataByIdAndDate = async (data) => {
  const response = await axiosInstance.post("/t2settings/get/chart", data);
  return response.data;
};

export const fetchT2PmtsBySettingId = async (settingId) => {
  const response = await axiosInstance.get(`/t2pmts/settingId/${settingId}`);
  return response.data;
};

export const fetchMultipleT2SettingsByLocations = async (locations) => {
  const response = await axiosInstance.post(
    "/t2settings/get-multiple/locations",
    locations
  );
  return response.data;
};

export const updateSelectedT2Setting = async (data) => {
  const response = await axiosInstance.patch(
    "/t2settings/update-one-row",
    data
  );
  return response.data;
};

export const deleteT2Setting = async (id) => {
  const response = await axiosInstance.delete(`/t2settings/delete-one/${id}`);
  return response.data;
};
