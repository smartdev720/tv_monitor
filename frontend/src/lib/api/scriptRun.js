import axiosInstance from "../axiosInstance";

export const runIPTVSettings = async (params) => {
  const response = await axiosInstance.post(
    "/script-run/iptv-settings",
    params
  );
  return response.data;
};

export const runAnalogSettings = async (params) => {
  const response = await axiosInstance.post(
    "/script-run/analog-settings",
    params
  );
  return response.data;
};

export const runT2Settings = async (params) => {
  const response = await axiosInstance.post("/script-run/t2-settings", params);
  return response.data;
};

export const runCableSettings = async (params) => {
  const response = await axiosInstance.post(
    "/script-run/cable-settings",
    params
  );
  return response.data;
};
