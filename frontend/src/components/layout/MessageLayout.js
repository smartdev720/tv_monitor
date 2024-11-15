import React, { useEffect, useState } from "react";
import { MessageAlert } from "../common/user/MessageAlert";
import { message, Badge } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  fetchNewMessageByUserId,
  updateCheckedMessageById,
} from "../../lib/api";
import { getDateWithISO } from "../../constant/func";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export const MessageLayout = ({ open, setOpen, setNotifyCounts }) => {
  const [messages, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const getNewMessages = async (userId) => {
      try {
        debugger;
        const response = await fetchNewMessageByUserId(userId);
        if (response.ok) {
          setMessages(response.data);
        }
      } catch (err) {
        message.error(t("badRequest"));
      }
    };
    if (user.id) {
      getNewMessages(user.id);
      const intervalId = setInterval(() => {
        getNewMessages(user.id);
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const handleOnClick = async (id) => {
    try {
      const date = new Date().toISOString().split("T")[0];
      const response = await updateCheckedMessageById({
        id,
        date: date,
      });
      if (response.ok) {
        const remessages = messages.filter((message) => message.id !== id);
        setMessages(remessages);
        setNotifyCounts(remessages.length);
      }
    } catch (err) {
      message.error(t("badRequest"));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setNotifyCounts(messages.length);
  }, [messages]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        background: "black",
        width: 700,
        right: 0,
        bottom: 0,
        height: 300,
        overflowX: "hidden",
        overflowY: "scroll",
        borderRadius: 20,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>

      <TransitionGroup>
        {messages.map((message) => (
          <CSSTransition key={message.id} timeout={300} classNames="fade">
            <MessageAlert
              key={message.id}
              message={message}
              onClick={handleOnClick}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};
