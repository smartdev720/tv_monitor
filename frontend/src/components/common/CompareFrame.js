import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Col, Row } from "antd";

export const CompareFrame = ({ imgs, data }) => {
  const [currentTime, setCurrentTime] = useState(imgs[0]?.time || null);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const children = Array.from(container.children);
      const containerCenter = container.scrollLeft + container.clientWidth / 2;

      let closestChild = children[0];
      let minDistance = Math.abs(
        containerCenter - closestChild.offsetLeft - closestChild.clientWidth / 2
      );

      children.forEach((child, index) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const distance = Math.abs(containerCenter - childCenter);
        if (distance < minDistance) {
          closestChild = child;
          minDistance = distance;
          setCurrentTime(imgs[index].time);
        }
      });
    }
  };

  const handleHorizontalScroll = (event) => {
    event.preventDefault();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [imgs]);

  return (
    <div style={{ padding: 10 }}>
      {data && (
        <Row gutter={16}>
          <Col span={20}>
            <div
              ref={scrollContainerRef}
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "16px",
                paddingBottom: "10px",
              }}
              onWheel={handleHorizontalScroll}
            >
              {imgs.map((img, index) => (
                <Card key={index} style={{ minWidth: "150px" }}>
                  <img
                    src={img.src}
                    alt={`img-${index}`}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </Card>
              ))}
            </div>
          </Col>
          <Col
            span={4}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <h3
              style={{ color: "white" }}
            >{`${data.deviceId} ${data.devicePlace}`}</h3>
            <div style={{ textAlign: "right" }}>
              <Button
                color={`${data.isDelayed ? "danger" : "primary"}`}
                style={{ textAlign: "right", padding: "2px 10px" }}
                variant="solid"
              >
                {data.delay}
              </Button>
            </div>
            <p style={{ color: "white" }}>{currentTime}</p>
          </Col>
        </Row>
      )}
    </div>
  );
};
