import React, { useState, useCallback, useEffect } from "react";
import { Col, Row, Table, Switch, Button, message } from "antd";
import { Spinner, Dropdown, InputField } from "../components/common";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import { fetchAllDevices, updateDevice } from "../lib/api";
import { SendOutlined } from "@ant-design/icons";

export const Devices = () => {
  const [loading, setLoading] = useState(false);
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [currentDevice, setCurrentDevice] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [editInput, setEditInput] = useState({});
  const [disabled, setDisabled] = useState(false);

  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);

  // Call APIs To Backend
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

  const updateSelectedDevice = async (data) => {
    try {
      setLoading(true);
      const response = await updateDevice(data);
      if (response.ok) {
        setDataSource((prevData) =>
          prevData.map((item) =>
            item.key === data.id ? { ...item, ...data } : item
          )
        );
        setEditInput({});
        setCurrentDevice({});
        message.success(response.message);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceChange = async (value) => {
    const selectedDevice = devices.find((device) => device.id === value);
    setCurrentDevice(selectedDevice);
    setEditInput(selectedDevice);
  };

  const handleEditChange = (e) =>
    setEditInput({ ...editInput, [e.target.name]: e.target.value });

  const handleEditActiveChange = (checked) => {
    const newValue = checked ? 1 : 0;
    setEditInput((prev) => ({
      ...prev,
      active: newValue,
    }));
  };

  const isValidEdit = () => {
    const { name, place, active, id } = editInput;
    if (name === "" || place === "" || active === "" || id === "") {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (isValidEdit()) {
      await updateSelectedDevice(editInput);
    } else {
      message.warning("Please input all values");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Place",
      dataIndex: "place",
    },
    {
      title: "Active",
      dataIndex: "active",
    },
  ];

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
      const dtSource = devices.map((dv) => ({
        key: dv.id,
        id: dv.id,
        name: dv.name,
        place: dv.place,
        active: dv.active,
      }));
      setDataSource(dtSource);
    }
  }, [devices]);

  useEffect(() => {
    if (editInput.id) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [editInput]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={12}>
          <h1>List Of Devices</h1>
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        </Col>
        <Col span={1}></Col>
        <Col span={11} style={{ marginTop: 30 }}>
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 5 }}>
              <label style={{ fontSize: "1em" }}>Select Device</label>
            </div>
            <Dropdown
              options={devicesOptions}
              handleChange={handleDeviceChange}
              value={currentDevice.id}
            />
          </div>

          <InputField
            name="name"
            placeholder="Name"
            value={editInput.name}
            onChange={handleEditChange}
            disabled={disabled}
          />
          <InputField
            name="place"
            placeholder="Place"
            value={editInput.place}
            onChange={handleEditChange}
            disabled={disabled}
          />
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 5 }}>
              <label style={{ fontSize: "1em" }}>Active</label>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Switch
                checked={editInput.active === 1}
                value={editInput.active}
                onChange={handleEditActiveChange}
              />
              <Button color="primary" variant="solid" onClick={handleSave}>
                Save <SendOutlined style={{ marginLeft: 8 }} />
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
