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
  iptvMissed,
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

  const missedIptvTypeDropdown = [
    { value: "analog_settings", label: "Analog" },
    { value: "t2_settings", label: "DVB-T2" },
    { value: "cable_settings", label: "DVB-C" },
  ];

  useEffect(() => {
    if (required) {
      setTvTypeDropdown(requiredTvTypeDropdown);
      return;
    }
    if (iptvMissed) {
      setTvTypeDropdown(missedIptvTypeDropdown);
      return;
    }
    setTvTypeDropdown(normalTvTypeDropdown);
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
            tvTypeDropdownValue !== "" ? tvTypeDropdownValue : t("selectTvType")
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
              : t("selectSettingName")
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
