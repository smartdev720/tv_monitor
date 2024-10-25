import axiosInstance from "../axiosInstance";

export const fetchAnalogSettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(
    `/analog-settings/device/${deviceId}`
  );
  return response.data;
};
