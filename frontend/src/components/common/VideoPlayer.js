import React from "react";
import { Card } from "antd";

export const VideoPlayer = ({ videoSrc }) => {
  return (
    <Card
      title="Video Player"
      style={{ width: 600, boxShadow: "1px 5px 2px 2px lightgray" }}
    >
      <div
        style={{
          position: "relative",
          paddingTop: "56.25%" /* 16:9 Aspect Ratio */,
        }}
      >
        <iframe
          title="Video Player"
          src={videoSrc}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allowFullScreen
        />
      </div>
    </Card>
  );
};
