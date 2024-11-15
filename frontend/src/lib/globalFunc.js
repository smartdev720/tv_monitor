import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import { message } from "antd";
import {
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
  fetchDevicesById,
  fetchMultipleAnalogSettingsByLocations,
  fetchMultipleIPTVSettingsByLocations,
  fetchMultipleCableSettingsByLocations,
  fetchMultipleT2SettingsByLocations,
  fetchComparesBadData,
  fetchGroupByBadDataCnt,
} from "./api";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useGlobal = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const getDevicesById = async (locations) => {
    try {
      setLoading(true);
      if (locations) {
        const response = await fetchDevicesById({ locations });
        if (response.ok) {
          dispatch(setDevices(response.data));
        }
      }
    } catch (err) {
      console.error(t("badRequest"));
    } finally {
      setLoading(false);
    }
  };

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
      message.error(t("badRequest"));
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
      message.error(t("badRequest"));
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
      message.error(t("badRequest"));
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
      message.error(t("badRequest"));
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
      message.error(t("badRequest"));
    } finally {
      setLoading(false);
    }
  };

  const getAllSettings = async (data) => {
    try {
      setLoading(true);
      if (!data.locations) return null;

      let settings = {};

      // Fetch all setting types
      const analogResponse = await fetchMultipleAnalogSettingsByLocations(data);
      if (analogResponse.ok) {
        settings.analog = analogResponse.data;
      }

      const iptvResponse = await fetchMultipleIPTVSettingsByLocations(data);
      if (iptvResponse.ok) {
        settings.iptv = iptvResponse.data;
      }

      const cableResponse = await fetchMultipleCableSettingsByLocations(data);
      if (cableResponse.ok) {
        settings.cable = cableResponse.data;
      }

      const t2Response = await fetchMultipleT2SettingsByLocations(data);
      if (t2Response.ok) {
        settings.t2 = t2Response.data;
      }

      const formattedSettings = data.locations.map((location) => {
        const locationId = location.location_id;
        return {
          locationId,
          analog: findSettingByLocationId(settings.analog, locationId),
          cable: findSettingByLocationId(settings.cable, locationId),
          iptv: findSettingByLocationId(settings.iptv, locationId),
          t2: findSettingByLocationId(settings.t2, locationId),
        };
      });

      const compareResponse = await fetchComparesBadData({
        date: data.date,
      });
      if (compareResponse.ok) {
        const compareCnts = compareResponse.data;
        return {
          setting: formattedSettings,
          compareCnts,
        };
      }
    } catch (err) {
      message.error(t("badRequest"));
    } finally {
      setLoading(false);
    }
  };

  const findSettingByLocationId = (settings, locationId) => {
    const mainSetting = settings?.main.find((s) => s.locationId === locationId);
    return mainSetting
      ? { id: mainSetting.settingId, badData: mainSetting.badData }
      : { id: null, badData: null };
  };

  const getGroupByBadDataCnt = async (cnt) => {
    try {
      setLoading(true);
      const response = await fetchGroupByBadDataCnt(cnt);
      if (response.ok) {
        return response.data;
      }
      return null;
    } catch (err) {
      message.error(t("badRequest"));
    } finally {
      setLoading(false);
    }
  };

  const getBadData = async (date) => {
    try {
      const response = await fetchComparesBadData({ date });
      if (response.ok) {
        return response.data;
      }
      return null;
    } catch (err) {
      message.error(t("badRequest"));
    }
  };

  return {
    getDevicesById,
    getSettingsAndFillSettingId,
    getPmtsBySettingIdBeforeDate,
    getVideoListByIdAndDate,
    getPmtsBySettingId,
    setLoading,
    getChartDataByIdAndDate,
    getAllSettings,
    getGroupByBadDataCnt,
    getBadData,
    loading,
  };
};
