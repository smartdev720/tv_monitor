import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const navMenu = [
  { label: "Analog setting", path: "/analog-setting" },
  { label: "DVB-T2 setting", path: "/dvb-t2-setting" },
  { label: "DVB-C setting", path: "/dvb-c-setting" },
  { label: "IPTV setting", path: "/iptv-setting" },
  { label: "Sequence", path: "/sequence" },
  { label: "Groups", path: "/groups" },
  { label: "Group commands", path: "/group-commands" },
];

export const Navbar = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();

  const selectedKey = navMenu
    .findIndex((item) => item.path === location.pathname)
    .toString();

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
