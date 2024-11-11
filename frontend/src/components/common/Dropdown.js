import React from "react";
import { Select } from "antd";

export const Dropdown = ({
  value,
  options,
  handleChange,
  placeholder,
  disabled,
}) => {
  return (
    <Select
      defaultValue={placeholder}
      placeholder={placeholder}
      style={{
        display: "block",
      }}
      onChange={handleChange}
      options={options}
      value={value}
      disabled={disabled}
    />
  );
};
