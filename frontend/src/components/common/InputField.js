import React from "react";
import { Input } from "antd";

export const InputField = ({
  name,
  placeholder,
  value,
  onChange,
  tooltip,
  disabled,
}) => {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ marginBottom: 5 }}>
        <label style={{ fontSize: "1em" }}>{placeholder}</label>
      </div>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {tooltip && (
        <div style={{ marginTop: 5 }}>
          <label style={{ fontSize: "0.9em", color: "#4db818" }}>
            {tooltip}
          </label>
        </div>
      )}
    </div>
  );
};
