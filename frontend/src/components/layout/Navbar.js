import React, { useEffect, useState } from "react";
import { Button, Dropdown, Layout, Menu, message, theme } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import { setAuthToken } from "../../lib/axiosInstance";
import { LanguageSwitcher } from "../common";
import { useTranslation } from "react-i18next";

const { Header } = Layout;

export const Navbar = () => {
  const { t } = useTranslation();

  const [navMenu, setNavMenu] = useState([]);

  const adminMenu = [
    { label: `${t("devices")}`, path: "/devices" },
    { label: `${t("analog")}`, path: "/analog-setting" },
    { label: "DVB-T2", path: "/dvb-t2-setting" },
    { label: "DVB-C", path: "/dvb-c-setting" },
    { label: "IPTV", path: "/iptv-setting" },
    { label: `${t("sequence")}`, path: "/sequence" },
    { label: `${t("groups")}`, path: "/groups" },
    { label: `${t("schedules")}`, path: "/schedules" },
  ];

  const userMenu = [
    { label: `${t("main")}`, path: "/main" },
    { label: `${t("chart")}`, path: "/chart" },
    { label: `${t("table")}`, path: "/table" },
    { label: `${t("video")}`, path: "/video" },
    { label: `${t("compare")}`, path: "/compare" },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [username, setUsername] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const selectedKey = navMenu
    .findIndex((item) => item.path === location.pathname)
    .toString();

  const handleLogout = () => {
    localStorage.removeItem("tv_monitor_token");
    dispatch(setUser(null));
    navigate("/auth/login");
    setAuthToken(null);
    message.warning("You log out");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" style={{ padding: "5px 20px" }}>
        <Button type="link" style={{ color: "white" }} onClick={handleLogout}>
          {t("logout")}
        </Button>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (user) {
      setNavMenu(user.role === "admin" ? adminMenu : userMenu);
      setUsername(`${user.name2 ? user.name2 : "NONE"}`);
    }
  }, [user]);

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          backgroundColor: "#000000",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "70%",
          }}
        >
          <div className="demo-logo">
            <h1 style={{ color: "white" }}>{t("tvMonitor")}</h1>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            style={{
              flex: 1,
              minWidth: 0,
              marginLeft: 20,
              backgroundColor: "#000000",
            }}
          >
            {navMenu.map((item, index) => (
              <Menu.Item key={index} style={{ color: "white" }}>
                <Link to={item.path} style={{ color: "white" }}>
                  {item.label}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <LanguageSwitcher />
          <Dropdown overlay={menu} trigger={["click"]}>
            <button
              style={{
                background: "none",
                color: "white",
                border: "none",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <UserOutlined style={{ marginRight: 15 }} />
              <span style={{ fontSize: "1.2em", marginRight: 10 }}>
                {username}
              </span>
              <DownOutlined style={{ marginLeft: 3 }} />
            </button>
          </Dropdown>
        </div>
      </Header>
    </Layout>
  );
};
