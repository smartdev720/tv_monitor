import axiosInstance from "../axiosInstance";

export const fetchIPTVSettingsByDeviceId = async (deviceId) => {
  const response = await axiosInstance.get(
    `/iptv-settings/deviceId/${deviceId}`
  );
  return response.data;
};

export const fetchIPTVVideoListByIdAndDate = async (data) => {
  const response = await axiosInstance.post("/iptv-settings/get/video", data);
  return response.data;
};

export const fetchMultipleIPTVSettingsByLocations = async (locations) => {
  const response = await axiosInstance.post(
    "/iptv-settings/get-multiple/locations",
    locations
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
