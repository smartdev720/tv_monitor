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
      value={value}
      disabled={disabled}
      options={options.map((option) => ({
        ...option,
        style: option.style || {},
      }))}
    />
  );
};
