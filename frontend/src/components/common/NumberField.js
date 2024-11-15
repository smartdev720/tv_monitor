import React from "react";
import { InputNumber } from "antd";

export const NumberField = ({
  name,
  value,
  onChange,
  disabled,
  isInvalid,
  tooltip,
  placeholder,
  min,
}) => {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ marginBottom: 5 }}>
        <label style={{ fontSize: "1em", color: "white" }}>{placeholder}</label>
      </div>
      <InputNumber
        name={name}
        value={value ? value : 0}
        onChange={onChange}
        disabled={disabled}
        status={isInvalid ? "error" : ""}
        style={{ width: "100%" }}
        min={min ? min : 0}
        max={100}
        required
      />
      {tooltip && (
        <div style={{ marginTop: 5 }}>
          <label style={{ fontSize: "0.9em", color: "#1668dc" }}>
            {tooltip}
          </label>
        </div>
      )}
    </div>
  );
};
