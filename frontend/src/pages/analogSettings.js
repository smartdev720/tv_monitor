import React, { useState, useCallback, useEffect } from "react";
import { Row, Col, Button, Table, Input, Checkbox, Flex } from "antd";
import { Dropdown, Spinner, VideoPlayer } from "../components/common";
import { fetchAllDevices, fetchAnalogSettingsByDeviceId } from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import {} from "@ant-design/icons";

export const AnalogSettings = () => {
  const [loading, setLoading] = useState(false);
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [currentDevice, setCurrentDevice] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);

  const getAllDevices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllDevices();
      if (response.ok) {
        dispatch(setDevices(response.data));
      }
    } catch (err) {
      console.error("Server error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllDevices();
  }, [getAllDevices]);

  useEffect(() => {
    if (devices.length > 0) {
      const deviceOpts = devices.map((device) => ({
        value: device.id,
        label: device.id,
      }));
      setDevicesOptions(deviceOpts);
    }
  }, [devices]);

  const handleDeviceChange = async (value) => {
    try {
      setLoading(true);
      const selectedDevice = devices.find((device) => device.id === value);
      setCurrentDevice(selectedDevice);
      const response = await fetchAnalogSettingsByDeviceId(value);
      if (response.ok) {
        const { data } = response;
        console.log(data);
        const ds = data.map((dt) => ({
          key: dt.id,
          logo: (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Checkbox />
              <span style={{ marginRight: 10 }}>
                logos/{dt.program_name ? dt.program_name : "nologo.png"}
              </span>
            </div>
          ),
          program_name: dt.program_name,
          frequency: dt.frerquency,
          standart: dt.standart,
          active: (
            <Button
              style={{ width: 20, height: 33, borderRadius: "50%" }}
              color={dt.active && dt.active === 1 ? "primary" : "danger"}
              variant="solid"
            />
          ),
          pwr: (
            <Button
              style={{ width: 20, height: 33, borderRadius: "50%" }}
              color={dt.pwr ? "primary" : "danger"}
              variant="solid"
            />
          ),
        }));
        setDataSource(ds);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const defaultColumns = [
    {
      title: "Logo",
      dataIndex: "logo",
    },
    {
      title: "Program name",
      dataIndex: "program_name",
      editable: true,
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      editable: true,
    },
    {
      title: "Standart",
      dataIndex: "standart",
      editable: true,
    },
    {
      title: "Active",
      dataIndex: "active",
    },
    {
      title: "PWR",
      dataIndex: "pwr",
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable && !col.checkbox) {
      return col;
    }
    return {
      ...col,
      render: (_, record) => (
        <Input
          value={record[col.dataIndex]}
          onChange={(e) =>
            handleRowChange(e.target.value, record.key, col.dataIndex)
          }
          disabled
        />
      ),
    };
  });

  const handleRowChange = (value, key, dataIndex) => {
    setDataSource((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, [dataIndex]: value } : item
      )
    );
  };

  const validateInputs = (frequency, standard, active, programName) => {
    const errors = {};
    const frequencyPattern = /^0[0-9]{5}$/;
    if (!frequencyPattern.test(frequency)) {
      errors.frequency =
        "Frequency must be a 6-digit string starting with 0 (e.g., 045000).";
    }
    const validStandards = ["0", "1", "2", "3", "4"];
    if (!validStandards.includes(standard)) {
      errors.standard =
        "Standard must be one of the following: 0 (M/N), 1 (B), 2 (G/H), 3 (I), 4 (D/K).";
    }
    if (!programName || programName.trim() === "") {
      errors.programName = "Program name is required.";
    }
    return errors;
  };

  useEffect(() => {
    if (currentDevice.id) {
      if (!dataSource.some((ds) => ds.key === currentDevice.id)) {
      }
    }
  }, [currentDevice.id]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={4}>
          <Dropdown
            options={devicesOptions}
            handleChange={handleDeviceChange}
            placeholder="devices"
            value={currentDevice.id}
          />
        </Col>
        <Col span={4}>
          <Input
            placeholder="device name"
            value={currentDevice.name && currentDevice.name}
            disabled
            style={{ color: "black" }}
          />
        </Col>
        <Col span={4}>
          <Input
            placeholder="device place"
            value={currentDevice.place && currentDevice.place}
            disabled
            style={{ color: "black" }}
          />
        </Col>
        <Col span={4}>
          <Button
            style={{ padding: 10, marginRight: 20 }}
            color={
              currentDevice.active && currentDevice.active === 1
                ? "primary"
                : "danger"
            }
            variant="solid"
          />
          <Button
            style={{ padding: 10 }}
            color={
              currentDevice.online && currentDevice.online === 1
                ? "primary"
                : "danger"
            }
            variant="solid"
          />
        </Col>
      </Row>
      <div style={{ marginTop: 20, height: "70vh", overflowX: "hidden" }}>
        <Row gutter={16}>
          <Col span={16}>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </Col>
          <Col span={8}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VideoPlayer videoSrc="" />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
