import React, { useState, useCallback, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  Input,
  Progress,
  Radio,
  Switch,
  message,
} from "antd";
import {
  CustomModal,
  Dropdown,
  InputField,
  Spinner,
  VideoPlayer,
} from "../components/common";
import { fetchAllDevices, fetchAnalogSettingsByDeviceId } from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import { EditOutlined, SendOutlined } from "@ant-design/icons";

export const AnalogSettings = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [currentDevice, setCurrentDevice] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [selectedRow, setSelectedRow] = useState({});
  const [editInput, setEditInput] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pwrPercent, setPwrPercent] = useState(0);
  const [standartDropdownValue, setStandartDropdownValue] = useState("");
  const [activeDropdownValue, setActiveDropdownValue] = useState("");

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
  }, [dispatch]);

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
        const ds = data.map((dt) => ({
          key: dt.id,
          logo: `logos / ${dt.program_name ? dt.program_name : "nologo.png"}`,
          program_name: dt.program_name,
          frequency: dt.frerquency,
          standart: dt.standart,
          active: dt.active,
          pwr: dt.pwr ? dt.pwr : "0",
        }));
        setDataSource(ds);
        setEditInput({});
        setSelectedRow({});
        setSelectedRowKey("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelect = (key, record) => {
    setSelectedRowKey(key === selectedRowKey ? null : key);
    setSelectedRow(record);
  };

  const columns = [
    {
      title: "Select",
      render: (_, record) => (
        <Radio
          checked={selectedRowKey === record.key}
          onChange={() => handleRowSelect(record.key, record)}
        />
      ),
    },
    {
      title: "Logo",
      dataIndex: "logo",
    },
    {
      title: "Program Name",
      dataIndex: "program_name",
      editable: true,
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      editable: true,
    },
    {
      title: "Standard",
      dataIndex: "standart",
      editable: true,
    },
    {
      title: "Active",
      dataIndex: "active",
      render: (active) => (
        <Button
          style={{ width: 20, height: 33, borderRadius: "50%" }}
          color={active && active === 1 ? "primary" : "danger"}
          variant="solid"
        />
      ),
    },
    {
      title: "PWR",
      dataIndex: "pwr",
    },
  ];

  const standartDropdownOptions = [
    { value: "1", label: "M/N" },
    { value: "2", label: "B" },
    { value: "3", label: "G/H" },
    { value: "4", label: "I" },
    { value: "5", label: "D/K" },
  ];

  const activeDropdownOptions = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
  ];

  const handleStandartChange = (value) => setStandartDropdownValue(value);

  const handleActiveChange = (value) => setActiveDropdownValue(value);

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

  const handleEditChange = (e) =>
    setEditInput({ ...editInput, [e.target.name]: e.target.value });

  const handleEdit = () => {
    if (selectedRow.key) {
      setOpen(true);
      setEditInput(selectedRow);
    } else {
      message.warning("Please select a row on the table");
    }
  };

  const handleEditOk = async () => {
    try {
      setConfirmLoading(true);
      const { frequency, standart, active, program_name } = editInput;
      const validationErrors = validateInputs(
        frequency,
        standart,
        active,
        program_name
      );
      if (Object.keys(validationErrors).length > 0) {
        message.error("Please input the correct values");
      } else {
        const transferedData = {
          device_id: currentDevice.id,
          analog_settings_id: editInput.key,
        };
        setOpen(false);
        setEditInput({});
      }
    } catch (err) {
    } finally {
      setConfirmLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16} style={{ display: "flex", alignItems: "center" }}>
        <Col span={4}>
          <Dropdown
            options={devicesOptions}
            handleChange={handleDeviceChange}
            placeholder="Devices"
            value={currentDevice.id}
          />
        </Col>
        <Col span={4}>
          <Input
            placeholder="Device Name"
            value={currentDevice.name}
            disabled
            style={{ color: "black" }}
          />
        </Col>
        <Col span={1}>
          <Switch
            style={{ padding: 10, marginRight: 20 }}
            checked={
              currentDevice.active && currentDevice.active === 1 ? true : false
            }
          />
        </Col>
        <Col span={1}>
          <Button
            style={{ width: 20, height: 33, borderRadius: "50%" }}
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
            <div style={{ padding: 10, marginTop: 30 }}>
              <Progress
                percent={pwrPercent}
                percentPosition={{ align: "center", type: "inner" }}
                size={["100%", 20]}
                strokeColor="#4db818"
                style={{ color: "white" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                padding: 10,
              }}
            >
              <Button
                icon={<EditOutlined />}
                iconPosition="end"
                variant="solid"
                color="default"
                onClick={handleEdit}
                style={{ marginRight: 20 }}
              >
                Edit
              </Button>
              <Button
                icon={<SendOutlined />}
                iconPosition="end"
                variant="solid"
                color="primary"
                style={{ marginLeft: 20 }}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      <CustomModal
        open={open}
        handleCancel={() => setOpen(false)}
        title="Analog Setting Edit"
        confirmLoading={confirmLoading}
        handleOk={handleEditOk}
      >
        <div style={{ marginTop: 30 }}>
          <InputField
            name="frequency"
            placeholder="Frequency"
            value={editInput.frequency}
            onChange={handleEditChange}
          />
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 5 }}>
              <label style={{ fontSize: "1em" }}>Standart</label>
            </div>
            <Dropdown
              options={standartDropdownOptions}
              placeholder="Standart"
              handleChange={handleStandartChange}
              value={standartDropdownValue}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 5 }}>
              <label style={{ fontSize: "1em" }}>Active</label>
            </div>
            <Dropdown
              options={activeDropdownOptions}
              placeholder="Active"
              handleChange={handleActiveChange}
              value={activeDropdownValue}
            />
          </div>
          <InputField
            name="program_name"
            placeholder="Program name"
            value={editInput.program_name}
            onChange={handleEditChange}
          />
        </div>
      </CustomModal>
    </div>
  );
};
