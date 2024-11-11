import React, { useState, useEffect } from "react";
import { Row } from "antd";
import { useSelector } from "react-redux";
import { UserDropdownGroup } from "../components/common/user/userDropdownGroup";
import { Spinner } from "../components/common";
import { useGlobal } from "../lib/globalFunc";
import { getDateWithISO } from "../constant/func";

export const Video = () => {
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [tvTypeDropdownValue, setTvTypeDropdownValue] = useState("");
  const [settingIdDropdownValue, setSettingIdDropdownValue] = useState("");
  const [currentDevice, setCurrentDevice] = useState({});
  const [settingIdDropdown, setSettingIdDropdown] = useState([]);
  const [date, setDate] = useState(null);

  const { devices } = useSelector((state) => state.devices);
  const {
    getAllDevices,
    getPmtsBySettingIdBeforeDate,
    getSettingsAndFillSettingIdDropdown,
    loading,
  } = useGlobal();

  // Handle change event
  const handleDeviceChange = async (value) => {
    const selectedId = value.split(" ")[0];
    const selectedDevice = devices.find(
      (device) => device.id === Number(selectedId)
    );
    setCurrentDevice(selectedDevice);
    if (tvTypeDropdownValue !== "") {
      const data = await getSettingsAndFillSettingIdDropdown(
        tvTypeDropdownValue,
        selectedDevice.id
      );
      if (data) {
        const options = data
          .filter((dt) => dt.active === 1)
          .map((dt) => ({
            value: dt.id,
            label: dt.name,
          }));
        setSettingIdDropdownValue("");
        setSettingIdDropdown(options);
      }
    }
  };

  const handleTvDropdownChange = async (value) => {
    setTvTypeDropdownValue(value);
    if (currentDevice.id) {
      const data = await getSettingsAndFillSettingIdDropdown(
        value,
        currentDevice.id
      );
      if (data) {
        const options = data
          .filter((dt) => dt.active === 1)
          .map((dt) => ({
            value: dt.id,
            label: dt.name,
          }));
        setSettingIdDropdownValue("");
        setSettingIdDropdown(options);
      }
    }
  };

  const handleSettingIdDropdownChange = async (value) => {
    setSettingIdDropdownValue(value);

    if (date) {
      const formattedDate = getDateWithISO(date);
      const data = await getPmtsBySettingIdBeforeDate(
        tvTypeDropdownValue,
        value,
        formattedDate
      );
    }
  };

  const handleDatePickerChange = async (date) => {
    setDate(date);
    if (
      settingIdDropdownValue !== "" &&
      currentDevice.id &&
      tvTypeDropdownValue !== ""
    ) {
      const formattedDate = getDateWithISO(date);
      const data = await getPmtsBySettingIdBeforeDate(
        tvTypeDropdownValue,
        settingIdDropdownValue,
        formattedDate
      );
    }
  };
  ///////////////////////////////////////////////

  // Hooks
  useEffect(() => {
    if (devices.length > 0) {
      const deviceOpts = devices
        .filter((device) => device.active === 1)
        .map((device) => ({
          value: `${device.id} ${device.place}`,
          label: `${device.id} ${device.place}`,
        }));
      setDevicesOptions(deviceOpts);
    }
  }, [devices]);

  useEffect(() => {
    getAllDevices();
  }, [getAllDevices]);

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
