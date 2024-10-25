import React from "react";
import { Select } from "antd";

export const Dropdown = ({ value, options, handleChange, placeholder }) => {
  return (
    <Select
      defaultValue={placeholder}
      style={{
        display: "block",
      }}
      onChange={handleChange}
      options={options}
      value={value}
    />
  );
};
