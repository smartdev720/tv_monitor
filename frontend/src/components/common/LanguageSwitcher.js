import React from "react";
import { Dropdown, Menu } from "antd";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleMenuClick = (e) => {
    i18n.changeLanguage(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="en">English</Menu.Item>
      <Menu.Item key="ua">Українська</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <a
        className="ant-dropdown-link"
        style={{ color: "white" }}
        onClick={(e) => e.preventDefault()}
      >
        {t("selectLanguage")}
      </a>
    </Dropdown>
  );
};
