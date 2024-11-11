import React, { useEffect, useState } from "react";
import { DatePicker, Col } from "antd";
import { Dropdown } from "../Dropdown";
import { useTranslation } from "react-i18next";

export const UserDropdownGroup = ({
  devicesOptions,
  handleDeviceChange,
  currentDevice,
  handleTvDropdownChange,
  date,
  handleDatePickerChange,
  tvTypeDropdownValue,
  settingIdDropdown,
  settingIdDropdownValue,
  handleSettingIdDropdownChange,
  disabled,
  required,
}) => {
  const { t } = useTranslation();

  const [tvTypeDropdown, setTvTypeDropdown] = useState([]);

  const normalTvTypeDropdown = [
    { value: "analog_settings", label: "Analog" },
    { value: "iptv_settings", label: "IPTV" },
    { value: "t2_settings", label: "DVB-T2" },
    { value: "cable_settings", label: "DVB-C" },
  ];

  const requiredTvTypeDropdown = [
    { value: "t2_settings", label: "DVB-T2" },
    { value: "cable_settings", label: "DVB-C" },
  ];

  useEffect(() => {
    if (required) {
      setTvTypeDropdown(requiredTvTypeDropdown);
    } else {
      setTvTypeDropdown(normalTvTypeDropdown);
    }
  }, [required]);

  return (
    <>
      <Col span={3}>
        <Dropdown
          options={devicesOptions}
          handleChange={handleDeviceChange}
          value={
            currentDevice.id
              ? `${currentDevice.id} ${currentDevice.place}`
              : t("selectDevice")
          }
        />
      </Col>
      <Col span={3}>
        <Dropdown
          options={tvTypeDropdown}
          handleChange={handleTvDropdownChange}
          value={
            tvTypeDropdownValue !== "" ? tvTypeDropdownValue : "Select TV type"
          }
        />
      </Col>
      <Col span={3}>
        <Dropdown
          options={settingIdDropdown}
          handleChange={handleSettingIdDropdownChange}
          value={
            settingIdDropdownValue !== ""
              ? settingIdDropdownValue
              : "Select setting name"
          }
          disabled={disabled}
        />
      </Col>
      <Col span={3}>
        <DatePicker
          style={{ display: "block" }}
          onChange={handleDatePickerChange}
          value={date}
        />
      </Col>
    </>
  );
};
