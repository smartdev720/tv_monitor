import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row } from "antd";
import { Spinner } from "../components/common";
import { UserDropdownGroup } from "../components/common/user/userDropdownGroup";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../lib/globalFunc";

export const Main = () => {
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [tvTypeDropdownValue, setTvTypeDropdownValue] = useState("");
  const [settingIdDropdownValue, setSettingIdDropdownValue] = useState("");
  const [currentDevice, setCurrentDevice] = useState({});
  const [settingIdDropdown, setSettingIdDropdown] = useState([]);
  const [date, setDate] = useState(null);

  const { devices } = useSelector((state) => state.devices);
  const { t } = useTranslation();
  const { getAllDevices, getSettingsAndFillSettingId, loading } = useGlobal();

  const handleDeviceChange = async (value) => {
    const selectedId = value.split(" ")[0];
    const selectedDevice = devices.find(
      (device) => device.id === Number(selectedId)
    );
    setCurrentDevice(selectedDevice);
    if (tvTypeDropdownValue !== "") {
      const data = await getSettingsAndFillSettingId(
        tvTypeDropdownValue,
        selectedDevice.id
      );
      if (data) {
        const options = data
          .filter((dt) => dt.active === 1)
          .map((dt) => ({
            value: dt.id,
            label:
              tvTypeDropdownValue === "analog_settings"
                ? dt.program_name
                : dt.name,
          }));
        setSettingIdDropdownValue("");
        setSettingIdDropdown(options);
      }
    }
  };

  const handleTvDropdownChange = async (value) => {
    setTvTypeDropdownValue(value);
    if (currentDevice.id) {
      const data = await getSettingsAndFillSettingId(value, currentDevice.id);
      if (data) {
        const options = data
          .filter((dt) => dt.active === 1)
          .map((dt) => ({
            value: dt.id,
            label: value === "analog_settings" ? dt.program_name : dt.name,
          }));
        setSettingIdDropdownValue("");
        setSettingIdDropdown(options);
      }
    }
  };

  const handleSettingIdDropdownChange = async (value) => {
    setSettingIdDropdownValue(value);
  };

  const handleDatePickerChange = (date) => {
    setDate(date);
  };

  // Hooks
  useEffect(() => {
    getAllDevices();
  }, [getAllDevices]);

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
          date={date}
          handleTvDropdownChange={handleTvDropdownChange}
          tvTypeDropdownValue={tvTypeDropdownValue}
          settingIdDropdownValue={settingIdDropdownValue}
          handleSettingIdDropdownChange={handleSettingIdDropdownChange}
          settingIdDropdown={settingIdDropdown}
          disabled={settingIdDropdown.length === 0}
        />
      </Row>
    </div>
  );
};
