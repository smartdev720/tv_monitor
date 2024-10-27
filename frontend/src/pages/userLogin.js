import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { InputField } from "../components/common";
import { LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { fetchUserById, userLogin } from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserId } from "../store/slices/userSlice";
import { setAuthToken } from "../lib/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const UserLogin = () => {
  const [input, setInput] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const login = async (user) => {
    try {
      setLoading(true);
      const response = await userLogin(user);
      if (response.ok) {
        const { token } = response;
        localStorage.setItem("tv_monitor_token", token);
        setAuthToken(token);
        message.success("Welcome back");
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

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const isValidInput = () => {
    const { name, password, email } = input;
    if (
      !name ||
      name === "" ||
      !password ||
      password === "" ||
      !email ||
      email == ""
    ) {
      return false;
    }
    if (email && (!email.includes("@") || !email.includes("."))) {
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(input);
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
        <div style={{ marginTop: 20 }}>
          <p>
            Have you already registered or not ? Register
            <Button color="primary" variant="link">
              <Link to="/auth/register"> here</Link>
            </Button>
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
          <Button
            color="primary"
            variant="solid"
            type="submit"
            onClick={handleLogin}
            loading={loading}
            disabled={disabled}
            style={{ display: "inline-block", width: "100%" }}
          >
            Log in <LoginOutlined style={{ marginLeft: 8 }} />
          </Button>
        </div>
      </div>
    </div>
  );
};
