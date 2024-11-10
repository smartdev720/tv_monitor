import React from "react";
import { Card } from "antd";
import { useTranslation } from "react-i18next";

export const VideoPlayer = ({ videoSrc }) => {
  const { t } = useTranslation();

  return (
    <Card
      title={t("videoPlayer")}
      style={{ width: 600, boxShadow: "1px 5px 2px 2px lightgray" }}
    >
      <div
        style={{
          position: "relative",
          paddingTop: "56.25%" /* 16:9 Aspect Ratio */,
        }}
      >
        {videoSrc ? (
          <video controls style={{ width: "100%" }}>
            <source
              src={`http://localhost:5000/source/video${videoSrc}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>Loading video...</p>
        )}
      </div>
    </Card>
  );
};
