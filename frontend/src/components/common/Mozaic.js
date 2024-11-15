import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";
import { useSelector } from "react-redux";

export const Mozaic = ({ item }) => {
  const [location, setLocation] = useState({});
  const [isBgRed, setIsBgRed] = useState(false);
  const { devices } = useSelector((state) => state.devices);
  useEffect(() => {
    if (item.locationId && devices.length > 0) {
      const loc = devices.find((device) => device.id === item.locationId);
      if (loc) {
        setLocation(loc);
        if (loc.active === 1 && loc.online === 0) {
          setIsBgRed(true);
        }
      }
    }
  }, [item, devices]);
  return (
    <Col span={4} style={{ marginTop: 20 }}>
      <Card
        style={{ background: `${isBgRed ? "red" : ""}` }}
        title={`${location.id} ${location.place}`}
      >
        {(item.analog.id || item.iptv.id) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Analog Section */}
            {item.analog.id && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "white", marginRight: 20 }}>Analog</span>
                <Button
                  color={`${item.analog.badData ? "danger" : "primary"}`}
                  variant="solid"
                  style={{ width: 10, height: 33, borderRadius: "50%" }}
                />
              </div>
            )}

            {/* IPTV Section */}
            {item.iptv.id && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "white", marginRight: 20 }}>IPTV</span>
                <Button
                  color={`${item.iptv.badData ? "danger" : "primary"}`}
                  variant="solid"
                  style={{ width: 10, height: 33, borderRadius: "50%" }}
                />
              </div>
            )}
          </div>
        )}

        {/* DVB-T2 and DVB-C Section */}
        {(item.t2.id || item.cable.id) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            {/* DVB-T2 Section */}
            {item.t2.id && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "white", marginRight: 20 }}>DVB-T2</span>
                <Button
                  color={`${item.t2.badData ? "danger" : "primary"}`}
                  variant="solid"
                  style={{ width: 10, height: 33, borderRadius: "50%" }}
                />
              </div>
            )}

            {/* DVB-C Section */}
            {item.cable.id && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "white", marginRight: 20 }}>DVB-C</span>
                <Button
                  color={`${item.cable.badData ? "danger" : "primary"}`}
                  variant="solid"
                  style={{ width: 10, height: 33, borderRadius: "50%" }}
                />
              </div>
            )}
          </div>
        )}

        {item.compare.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", marginRight: 20 }}>Compare</span>
            <Button
              color={`${item.compareBadData.length > 0 ? "danger" : "primary"}`}
              variant="solid"
              style={{ width: 10, height: 33, borderRadius: "50%" }}
            />
          </div>
        )}
      </Card>
    </Col>
  );
};
