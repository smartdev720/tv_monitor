import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const VideoPlayer = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current && videoSrc !== "") {
      const videoElement = videoRef.current;
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
        <div className="">
          <h4 className="" style={{ textAlign: "center", color: "green" }}>
            If you want to watch a video, please select the setting and click
            apply.
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
