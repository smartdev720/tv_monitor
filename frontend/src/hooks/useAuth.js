import { message } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setUser } from "../store/slices/userSlice";
import { fetchUserById } from "../lib/api";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("tv_monitor_token");
    const allowedPaths = ["/auth/login", "/auth/register"];
    if (!token && !allowedPaths.includes(location.pathname)) {
      navigate("/auth/login");
    } else {
      if (token && typeof token === "string") {
        const decoded = jwtDecode(token);
        if (decoded.id) {
          const fetchUser = async (id) => {
            try {
              const response = await fetchUserById(id);
              if (response.ok) {
                dispatch(setUser(response.data));
              }
            } catch (err) {
              message.error("Server error");
            }
          };
          fetchUser(decoded.id);
        }
      }
    }
  }, [navigate, location]);
};
