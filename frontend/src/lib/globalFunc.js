import { useDispatch } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import { message } from "antd";
import {
  fetchAllDevices,
  fetchCablePmtsBySettingIdBeforeDate,
  fetchIPTVSettingsByDeviceId,
  fetchOnlyCableSettingsByDeviceId,
  fetchOnlyT2SettingsByDeviceId,
  fetchT2PmtsBySettingIdBeforeDate,
  fetchT2PmtsBySettingId,
  fetchCablePmtsBySettingId,
  fetchOnlyAnalogSettingsByDeviceId,
  fetchAnalogVideoListByIdAndDate,
  fetchIPTVVideoListByIdAndDate,
  fetchCableVideoListByIdAndDate,
  fetchT2VideoListByIdAndDate,
  fetchT2ChartDataByIdAndDate,
  fetchCableChartDataByIdAndDate,
  fetchAnalogChartDataByIdAndDate,
} from "./api";
import { useCallback, useState } from "react";

export const useGlobal = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const getAllDevices = useCallback(async () => {
    try {
      debugger;
      setLoading(true);
      const response = await fetchAllDevices();
      if (response.ok) {
        dispatch(setDevices(response.data));
      }
    } catch (err) {
      console.error("Server error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSettingsAndFillSettingId = async (tvType, deviceId) => {
    try {
      setLoading(true);
      let response;
      if (tvType === "t2_settings") {
        response = await fetchOnlyT2SettingsByDeviceId(deviceId);
      }
      if (tvType === "cable_settings") {
        response = await fetchOnlyCableSettingsByDeviceId(deviceId);
      }
      if (tvType === "analog_settings") {
        response = await fetchOnlyAnalogSettingsByDeviceId(deviceId);
      }
      if (tvType === "iptv_settings") {
        response = await fetchIPTVSettingsByDeviceId(deviceId);
      }
      if (response.ok) {
        return response.data;
      }
      return null;
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPmtsBySettingIdBeforeDate = async (
    tvType,
    settingId,
    selectedDate
  ) => {
    try {
      setLoading(true);
      let response;
      if (tvType === "t2_settings") {
        response = await fetchT2PmtsBySettingIdBeforeDate({
          id: settingId,
          date: selectedDate,
        });
      }
      if (tvType === "cable_settings") {
        response = await fetchCablePmtsBySettingIdBeforeDate({
          id: settingId,
          date: selectedDate,
        });
      }
      if (response.ok) {
        return response.data;
      }
      return null;
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPmtsBySettingId = async (tvType, settingId) => {
    try {
      setLoading(true);
      let response;
      if (tvType === "t2_settings") {
        response = await fetchT2PmtsBySettingId(settingId);
      }
      if (tvType === "cable_settings") {
        response = await fetchCablePmtsBySettingId(settingId);
      }
      if (response.ok) {
        return response.data;
      }
      return null;
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getVideoListByIdAndDate = async (tvType, data) => {
    try {
      setLoading(true);
      let response;
      if (tvType === "analog_settings") {
        response = await fetchAnalogVideoListByIdAndDate(data);
      }
      if (tvType === "iptv_settings") {
        response = await fetchIPTVVideoListByIdAndDate(data);
      }
      if (tvType === "cable_settings") {
        response = await fetchCableVideoListByIdAndDate(data);
      }
      if (tvType === "t2_settings") {
        response = await fetchT2VideoListByIdAndDate(data);
      }
      if (response.ok) {
        return response.data;
      }
      return null;
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getChartDataByIdAndDate = async (tvType, data) => {
    try {
      setLoading(true);
      let response;
      if (tvType === "analog_settings") {
        response = await fetchAnalogChartDataByIdAndDate(data);
      }
      if (tvType === "cable_settings") {
        response = await fetchCableChartDataByIdAndDate(data);
      }
      if (tvType === "t2_settings") {
        response = await fetchT2ChartDataByIdAndDate(data);
      }
      if (response.ok) {
        return response.data;
      }
      return null;
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllDevices,
    getSettingsAndFillSettingId,
    getPmtsBySettingIdBeforeDate,
    getVideoListByIdAndDate,
    getPmtsBySettingId,
    setLoading,
    getChartDataByIdAndDate,
    loading,
  };
};
