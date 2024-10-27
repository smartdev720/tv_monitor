import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { InputField } from "../components/common";
import { LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { userRegister } from "../lib/api";
import { useNavigate } from "react-router-dom";

export const UserRegister = () => {
  const [input, setInput] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const register = async (user) => {
    try {
      setLoading(true);
      const response = await userRegister(user);
      if (response.ok) {
        message.success("Registered successfully");
        navigate("/auth/login");
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    debugger;
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const isValidInput = () => {
    const { name, password, confirmPassword, email } = input;
    if (
      !name ||
      name === "" ||
      !password ||
      password === "" ||
      !email ||
      email == "" ||
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
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(input);
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
      <div
        style={{
          width: "30%",
          padding: 50,
          boxShadow: "0px 4px 5px 2px",
          borderRadius: 20,
        }}
      >
        <InputField
          type="text"
          name="name"
          placeholder="User Name"
          value={input.name}
          onChange={handleChange}
        />
        <InputField
          type="email"
          name="email"
          placeholder="Email"
          value={input.email}
          onChange={handleChange}
        />
        <InputField
          type="password"
          placeholder="Password"
          name="password"
          value={input.password}
          onChange={handleChange}
        />
        <InputField
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={input.confirmPasswrd}
          onChange={handleChange}
        />
        <div style={{ marginTop: 20 }}>
          <p>
            Have you already registered or not ? Log in
            <Button color="primary" variant="link">
              <Link to="/auth/login"> here</Link>
            </Button>
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
          <Button
            color="primary"
            variant="solid"
            type="submit"
            onClick={handleRegister}
            loading={loading}
            disabled={disabled}
            style={{ display: "inline-block", width: "100%" }}
          >
            Register <LoginOutlined style={{ marginLeft: 8 }} />
          </Button>
        </div>
      </div>
    </div>
  );
};
