import React from "react";
import { Tabs } from "antd";

export const Tab = ({ items, onChange, activeKey }) => (
  <Tabs items={items} activeKey={activeKey} onChange={onChange} />
);
