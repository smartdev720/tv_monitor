import axiosInstance from "../axiosInstance";

export const fetchT2SettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(`/t2settings/deviceId/${deviceId}`);
  return response.data;
};

export const fetchT2PmtsBySettingId = async (settingId) => {
  const response = await axiosInstance.get(`/t2pmts/settingId/${settingId}`);
  return response.data;
};

export const updateSelectedT2Setting = async (data) => {
  const response = await axiosInstance.patch(
    "/t2settings/update-one-row",
    data
  );
  return response.data;
};
