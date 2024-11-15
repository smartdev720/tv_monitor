import React from "react";
import { Button, Col, Row } from "antd";

export const MessageAlert = ({ message, onClick }) => {
  const fomateDate = (date) => {
    const dateObj = new Date(date);
    const localDate = new Date(
      dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
    );
    const formattedDate = localDate
      .toISOString()
      .replace("T", " ")
      .split(".")[0];
    return formattedDate;
  };

  return (
    <Row
      gutter={16}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: 45,
      }}
    >
      <Col span={23}>
        <p style={{ color: "white" }}>{message.message}</p>
      </Col>
      <Col span={1}>
        <Button
          type="text"
          onClick={() => onClick(message.id)}
          variant="solid"
          style={{ border: "1px solid #444444", fontSize: 15 }}
        >
          &times;
        </Button>
      </Col>
      {message.web_demo_time && (
        <Col span={24} style={{ marginTop: 20 }}>
          <p style={{ color: "#444444" }}>
            {fomateDate(message.web_demo_time)}
          </p>
        </Col>
      )}
    </Row>
  );
};
