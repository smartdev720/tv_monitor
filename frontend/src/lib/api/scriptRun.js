import axiosInstance from "../axiosInstance";

export const runIPTVSettings = async (params) => {
  debugger;
  const response = await axiosInstance.post(
    "/script-run/iptv-settings",
    params
  );
  return response.data;
};
