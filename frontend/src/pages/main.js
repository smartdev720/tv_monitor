import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDevices } from "../lib/api";
import { setDevices } from "../store/slices/devicesSlice";
import { Row } from "antd";
import { Dropdown, Spinner } from "../components/common";
import { UserDropdownGroup } from "../components/common/user/userDropdownGroup";
import { useTranslation } from "react-i18next";

export const Main = () => {
  const [loading, setLoading] = useState(false);
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [settingDropdownValue, setSettingDropdownValue] = useState("");
  const [frequencyDropdownValue, setFrequencyDropdownValue] = useState("");
  const [currentDevice, setCurrentDevice] = useState({});
  const [data, setData] = useState({});

  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);
  const { t } = useTranslation();

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

  useEffect(() => {
    getAllDevices();
  }, [getAllDevices]);

  const handleDeviceChange = async (value) => {
    setLoading(true);
    const selectedId = value.split(" ")[0];
    const selectedDevice = devices.find(
      (device) => device.id === Number(selectedId)
    );
    setCurrentDevice(selectedDevice);
  };

  const handleSettingsDropdown = (value) => setSettingDropdownValue(value);
  const handleFrequencyDropdown = (value) => setFrequencyDropdownValue(value);

  const handleDatePickerChange = (date) => {
    if (!date) {
      setData((prevData) => ({ ...prevData, date: null }));
      return;
    }
    setData((prevData) => ({ ...prevData, date }));
  };

  useEffect(() => {
    if (devices.length > 0) {
      const deviceOpts = devices.map((device) => ({
        value: `${device.id} ${device.place}`,
        label: `${device.id} ${device.place}`,
      }));
      setDevicesOptions(deviceOpts);
    }
  }, [devices]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <UserDropdownGroup
          devicesOptions={devicesOptions}
          currentDevice={currentDevice}
          handleDatePickerChange={handleDatePickerChange}
          handleDeviceChange={handleDeviceChange}
          date={data.date}
          handleSettingsDropdown={handleSettingsDropdown}
          frequencyDropdownValue={frequencyDropdownValue}
          settingDropdownValue={settingDropdownValue}
          handleFrequencyDropdown={handleFrequencyDropdown}
        />
      </Row>
    </div>
  );
};
