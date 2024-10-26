import axiosInstance from "../axiosInstance";

export const fetchCableSettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(
    `/cableSettings/deviceId/${deviceId}`
  );
  return response.data;
};

export const fetchCablePmtsBySettingId = async (settingId) => {
  const response = await axiosInstance.get(`/cablePmts/settingId/${settingId}`);
  return response.data;
};

export const updateSelectedCableSetting = async (data) => {
  const response = await axiosInstance.patch(
    "/cableSettings/update-one-row",
    data
  );
  return response.data;
};
