import { useDispatch } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import { message } from "antd";
import {
  fetchAllDevices,
  fetchCablePmtsBySettingIdBeforeDate,
  fetchOnlyCableSettingsByDeviceId,
  fetchOnlyT2SettingsByDeviceId,
  fetchT2PmtsBySettingIdBeforeDate,
} from "./api";
import { useCallback, useState } from "react";

export const useGlobal = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const getAllDevices = useCallback(async () => {
    try {
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

  const getSettingsAndFillSettingIdDropdown = async (tvType, deviceId) => {
    try {
      setLoading(true);
      let response;
      if (tvType === "t2_settings") {
        response = await fetchOnlyT2SettingsByDeviceId(deviceId);
      }
      if (tvType === "cable_settings") {
        response = await fetchOnlyCableSettingsByDeviceId(deviceId);
      }
      if (response.ok) {
        return response.data;
      }
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

  return {
    getAllDevices,
    getSettingsAndFillSettingIdDropdown,
    getPmtsBySettingIdBeforeDate,
    setLoading,
    loading,
  };
};
