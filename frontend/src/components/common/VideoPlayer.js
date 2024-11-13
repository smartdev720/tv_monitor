import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useTranslation } from "react-i18next";

export const VideoPlayer = ({ videoSrc, setIsVideoError, setLoading }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const prevVideoSrc = useRef(videoSrc);

  const { t } = useTranslation();

  useEffect(() => {
    if (!videoSrc || videoSrc === "" || videoSrc === prevVideoSrc) {
      return;
    }

    setLoading(true);
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    fetch(videoSrc)
      .then((response) => {
        if (!response.ok) {
          setIsVideoError(true);
          setLoading(false);
          throw new Error("Video not found");
        }
        setLoading(false);
        return response.blob();
      })
      .catch((err) => {});

    if (videoSrc && videoElement) {
      playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: videoSrc,
            type: "application/x-mpegURL",
          },
        ],
      });

      playerRef.current.on("ready", () => {
        console.log("Player is ready");
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoSrc]);

  return (
    <>
      {!videoSrc || videoSrc === "" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 100,
          }}
        >
          <h4 style={{ textAlign: "center", color: "white" }}>
            {t("videoError")}
          </h4>
        </div>
      ) : (
        <div data-vjs-player>
          <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
      )}
    </>
  );
};
