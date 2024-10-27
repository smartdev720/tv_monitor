import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Dropdown,
  Layout,
  Menu,
  message,
  theme,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import { setAuthToken } from "../../lib/axiosInstance";

const { Header } = Layout;

const navMenu = [
  { label: "Devices", path: "/devices" },
  { label: "Analog", path: "/analog-setting" },
  { label: "DVB-T2", path: "/dvb-t2-setting" },
  { label: "DVB-C", path: "/dvb-c-setting" },
  { label: "IPTV", path: "/iptv-setting" },
  { label: "Sequence", path: "/sequence" },
  { label: "Groups", path: "/groups" },
  { label: "Schedules", path: "/schedules" },
];

export const Navbar = () => {
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
        <Button type="link" onClick={handleLogout}>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (user) setUsername(user.name);
  }, [user]);

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <div className="demo-logo">
          <h1 style={{ color: "white" }}>TV MONITOR</h1>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          style={{
            flex: 1,
            minWidth: 0,
            marginLeft: 20,
          }}
        >
          {navMenu.map((item, index) => (
            <Menu.Item key={index}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
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
      <Breadcrumb
        style={{
          margin: "16px 0",
          padding: 20,
          fontWeight: "bold",
        }}
      >
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          {navMenu[selectedKey]?.label || "Home"}
        </Breadcrumb.Item>
      </Breadcrumb>
    </Layout>
  );
};
