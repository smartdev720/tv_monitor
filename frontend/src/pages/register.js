import React, { useEffect, useState } from "react";
import { Button, message, Row, Col } from "antd";
import { InputField } from "../components/common";
import { LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { register } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PhoneInput from "antd-phone-input";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const UserRegister = () => {
  const [input, setInput] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("ua");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    if (e.target) {
      setInput({ ...input, [e.target.name]: e.target.value });
    }
  };

  const handlePhoneChange = (value) => {
    const { areaCode, countryCode, phoneNumber } = value || {};
    const phoneString =
      areaCode && phoneNumber
        ? `+${countryCode} (${areaCode}) ${phoneNumber}`
        : "";
    setInput({ ...input, phone: phoneString });
  };
  const handleCountryChange = (value) => {
    setSelectedCountry(value);
  };

  const isValidInput = () => {
    const {
      firstName,
      lastName,
      nickName,
      password,
      confirmPassword,
      email,
      phone,
    } = input;
    if (
      !firstName ||
      firstName === "" ||
      !lastName ||
      lastName === "" ||
      !nickName ||
      nickName === "" ||
      !password ||
      password === "" ||
      !email ||
      email === "" ||
      !confirmPassword ||
      confirmPassword === ""
    ) {
      return false;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      return false;
    }
    if (email && (!email.includes("@") || !email.includes("."))) {
      return false;
    }
    const parsedPhoneNumber = parsePhoneNumberFromString(
      phone,
      selectedCountry
    );
    if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await register(input);
      if (response.ok) {
        message.success(t("registeredSuccessfully"));
        navigate("/auth/login");
      } else {
        message.warning(response.message);
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
        height: "100vh",
      }}
    >
      <Row justify="center" style={{ width: "100%" }}>
        <Col
          xs={22}
          sm={18}
          md={14}
          lg={10}
          xl={8}
          style={{
            padding: 30,
            boxShadow: "0px 4px 5px 2px",
            borderRadius: 20,
            backgroundColor: "white",
          }}
        >
          <InputField
            type="text"
            name="firstName"
            placeholder={t("firstName")}
            value={input.firstName}
            onChange={handleChange}
            isInvalid={input.firstName === ""}
          />
          <InputField
            type="text"
            name="lastName"
            placeholder={t("lastName")}
            value={input.lastName}
            onChange={handleChange}
            isInvalid={input.lastName === ""}
          />
          <InputField
            type="text"
            name="nickName"
            placeholder={t("nickName")}
            value={input.nickName}
            onChange={handleChange}
            isInvalid={input.nickName === ""}
          />
          <InputField
            type="email"
            name="email"
            placeholder={t("email")}
            value={input.email}
            onChange={handleChange}
            isInvalid={input.email === ""}
          />
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 5 }}>
              <label style={{ fontSize: "1em" }}>{t("phone")}</label>
            </div>
            <PhoneInput
              country={selectedCountry}
              onCountryChange={handleCountryChange}
              name="phone"
              value={input.phone}
              onChange={handlePhoneChange}
              required
              isInvalid={input.phone === ""}
            />
          </div>
          <InputField
            type="password"
            placeholder={t("password")}
            name="password"
            value={input.password}
            onChange={handleChange}
            isInvalid={input.password === ""}
          />
          <InputField
            type="password"
            placeholder={t("confirmPassword")}
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={handleChange}
            isInvalid={input.confirmPassword === ""}
          />
          <div style={{ marginTop: 20 }}>
            <div>
              <span>{t("alreadyRegistered")}</span>
              <Button type="link" style={{ padding: 0, marginLeft: 10 }}>
                <Link to="/auth/login"> {t("here")}</Link>
              </Button>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleRegister}
              loading={loading}
              disabled={disabled}
              style={{ display: "inline-block", width: "100%" }}
            >
              {t("register")} <LoginOutlined style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
