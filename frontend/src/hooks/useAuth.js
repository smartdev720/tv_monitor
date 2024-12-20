import { message } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setUser } from "../store/slices/userSlice";
import { fetchUserById } from "../lib/api";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("tv_monitor_token");
    const allowedPaths = ["/auth/login", "/auth/register"];
    const userPaths = ["/main", "/charts", "/table", "/video", "/compare"];
    const adminPath = [
      "/devices",
      "/analog-setting",
      "/dvb-t2-setting",
      "/dvb-c-setting",
      "/iptv-setting",
      "/sequence",
      "/groups",
      "/schedules",
    ];
    if (!token && !allowedPaths.includes(location.pathname)) {
      navigate("/auth/login");
      return;
    }

    if (token && typeof token === "string") {
      const decoded = jwtDecode(token);
      debugger;
      if (decoded.id && (!user || typeof user !== "object")) {
        const fetchUser = async (id) => {
          try {
            const response = await fetchUserById(id);
            if (response.ok) {
              dispatch(setUser(response.data));
              if (response.data.role !== "admin") {
                if (!userPaths.includes(location.pathname)) {
                  navigate("/main");
                }
              } else {
                if (!adminPath.includes(location.pathname)) {
                  navigate("/devices");
                }
              }
            }
          } catch (err) {
            message.error("Server error");
          }
        };
        fetchUser(decoded.id);
      }
    }
  }, [dispatch, navigate, location]);
};
