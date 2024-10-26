import axiosInstance from "../axiosInstance";

export const fetchIPTVSettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(
    `/iptv-settings/deviceId/${deviceId}`
  );
  return response.data;
};

export const updateIPTVSetting = async (data) => {
  const response = await axiosInstance.patch("/iptv-settings/update-one", data);
  return response.data;
};

export const deleteIPTVSetting = async (id) => {
  const response = await axiosInstance.delete(
    `/iptv-settings/delete-one/${id}`
  );
  return response.data;
};
