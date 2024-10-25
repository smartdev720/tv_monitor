import React from "react";
import { Input } from "antd";

export const InputField = ({ name, placeholder, value, onChange }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ marginBottom: 5 }}>
        <label style={{ fontSize: "1em" }}>{placeholder}</label>
      </div>
      <Input name={name} value={value} onChange={onChange} />
    </div>
  );
};
