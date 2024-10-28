import axiosInstance from "../axiosInstance";

export const fetchAnalogSettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(
    `/analog-settings/device/${deviceId}`
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
