import React, { useEffect, useState } from "react";
import { Button, message, Row, Col } from "antd";
import { InputField } from "../components/common";
import { LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { login } from "../lib/api";
import { setAuthToken } from "../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const [input, setInput] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const isValidInput = () => {
    const { password, email } = input;
    if (!password || password === "" || !email || email === "") {
      return false;
    }
    if (email && (!email.includes("@") || !email.includes("."))) {
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await login(input);
      debugger;
      if (response.ok) {
        const { token } = response;
        localStorage.setItem("tv_monitor_token", token);
        setAuthToken(token);
        message.success(t("welcomeBack"));
        navigate("/analog-setting");
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDisabled(!isValidInput());
  }, [input]);

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
      }}
    >
      <Row justify="center" style={{ width: "100%" }}>
        <Col
          xs={22}
          sm={18}
          md={12}
          lg={8}
          xl={6}
          style={{
            padding: 30,
            boxShadow: "0px 4px 5px 2px",
            borderRadius: 20,
            backgroundColor: "black",
          }}
        >
          <InputField
            type="email"
            name="email"
            placeholder={t("email")}
            value={input.email}
            onChange={handleChange}
            isInvalid={input.email === ""}
          />
          <InputField
            type="password"
            placeholder={t("password")}
            name="password"
            value={input.password}
            onChange={handleChange}
            isInvalid={input.password === ""}
          />
          <div style={{ marginTop: 20 }}>
            <div>
              <span style={{ color: "white" }}>{t("alreadyLoggined")}</span>
              <Button type="link" style={{ padding: 0, marginLeft: 10 }}>
                <Link to="/auth/register">{t("here")}</Link>
              </Button>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleLogin}
              loading={loading}
              disabled={disabled}
              style={{ display: "inline-block", width: "100%" }}
            >
              {t("login")} <LoginOutlined style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
