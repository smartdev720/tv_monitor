import axiosInstance from "../axiosInstance";

export const fetchAnalogSettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(
    `/analog-settings/device/${deviceId}`
  );
  return response.data;
};

export const fetchOnlyAnalogSettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(
    `/analog-settings/get/device/${deviceId}`
  );
  return response.data;
};

export const fetchAnalogVideoListByIdAndDate = async (data) => {
  const response = await axiosInstance.post("/analog-settings/get/video", data);
  return response.data;
};

export const fetchAnalogChartDataByIdAndDate = async (data) => {
  const response = await axiosInstance.post("/analog-settings/get/chart", data);
  return response.data;
};

export const fetchMultipleAnalogSettingsByLocations = async (locations) => {
  const response = await axiosInstance.post(
    "/analog-settings/get-multiple/locations",
    locations
  );
  return response.data;
};

export const updateAnalogSetting = async (data) => {
  const response = await axiosInstance.patch(
    "/analog-settings/update-one",
    data
  );
  return response.data;
};
