import React, { useCallback, useEffect, useState } from "react";
import { Col, Input, Row, Switch, Button, Table, Radio, message } from "antd";
import {
  ButtonGroup,
  CustomModal,
  Dropdown,
  InputField,
  Spinner,
} from "../components/common";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import {
  deleteSelectedT2Setting,
  deleteT2Setting,
  fetchAllDevices,
  fetchT2PmtsBySettingId,
  fetchT2SettingsByDeviceId,
  runT2Settings,
  updateSelectedT2Setting,
  updateT2PmtsUnderControlById,
} from "../lib/api";
import {
  getForamtedModulationFromDB,
  getForamtedModulationToDB,
} from "../constant/func";

export const T2Settings = () => {
  const [loading, setLoading] = useState(false);
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [currentDevice, setCurrentDevice] = useState({});
  const [settingDataSource, setSettingDataSource] = useState([]);
  const [pmtDataSource, setPmtDataSource] = useState([]);
  const [settingSelectedRowKey, setSettingSelectedRowKey] = useState("");
  const [settingSelectedRow, setSettingSelectedRow] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editInput, setEditInput] = useState({});
  const [popLoading, setPopLoading] = useState(false);
  const [popOpen, setPopOpen] = useState(false);

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

  const getT2PmtsBySelectedSetting = async (settingId) => {
    try {
      setLoading(true);
      const response = await fetchT2PmtsBySettingId(settingId);
      if (response.ok) {
        const { data } = response;
        const dataSource = data.map((dt) => ({
          key: dt.id,
          service_name: dt.service_name,
          under_control: dt.under_control,
        }));
        setPmtDataSource(dataSource);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getT2SettingsByDeviceId = async (deviceId) => {
    if (deviceId) {
      try {
        setLoading(true);
        const response = await fetchT2SettingsByDeviceId(deviceId);
        if (response.ok) {
          const { data } = response;
          const dataSource = data.map((dt) => ({
            key: dt.id,
            frequency: dt.frequency,
            modulation_type: getForamtedModulationFromDB(dt.modulation_type),
            symbol_rate: dt.symbol_rate,
            plp: dt.plp,
            pwr: dt.pwr ? dt.pwr : "0",
            active: dt.active,
          }));
          setSettingDataSource(dataSource);
          setPmtDataSource([]);
        }
      } catch (err) {
        message.error("Server error");
      } finally {
        setLoading(false);
      }
    }
  };

  const updateSelectedT2SettingRow = async (data) => {
    try {
      setConfirmLoading(true);
      const response = await updateSelectedT2Setting(data);
      if (response.ok) {
        message.success(response.message);
        setOpen(false);
        const selectedRow = {
          ...data,
          modulation_type: getForamtedModulationFromDB(data.modulation_type),
        };
        setSettingSelectedRow(selectedRow);
        setSettingSelectedRowKey(selectedRow.key);
        setSettingDataSource((prevData) =>
          prevData.map((item) =>
            item.key === selectedRow.key ? { ...item, ...selectedRow } : item
          )
        );
        setEditInput({});
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setConfirmLoading(false);
    }
  };

  const updateSelectedT2pmtsUnderControl = async (data) => {
    try {
      setLoading(true);
      const response = await updateT2PmtsUnderControlById(data);
      if (response.ok) {
        setPmtDataSource((prevData) =>
          prevData.map((item) =>
            item.key === data.key
              ? { ...item, under_control: data.under_control }
              : item
          )
        );
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedT2Setting = async (id) => {
    try {
      setPopLoading(true);
      const response = await deleteT2Setting(id);
      if (response.ok) {
        setPopOpen(false);
        const index = settingDataSource.findIndex((ds) => ds.key === id);
        if (index !== -1) {
          const dtSource = settingDataSource.filter((_, i) => i !== index);
          setSettingDataSource(dtSource);
        }
        setSettingSelectedRow({});
        setSettingSelectedRowKey("");
        setPmtDataSource([]);
        message.success(response.message);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setPopLoading(false);
    }
  };

  const runScript = async (scriptParams) => {
    try {
      setLoading(true);
      const response = await runT2Settings(scriptParams);
      if (response.ok) {
        message.success("Run script successfully");
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////

  const handleSettingRowSelect = async (key, record) => {
    setSettingSelectedRowKey(key === settingSelectedRowKey ? null : key);
    setSettingSelectedRow(record);
    await getT2PmtsBySelectedSetting(key);
  };

  const handlePmtSwitchChange = async (key, record) => {
    const newValue = record.under_control === 1 ? 0 : 1;
    await updateSelectedT2pmtsUnderControl({ key, under_control: newValue });
  };

  const settingColumn = [
    {
      title: "Select",
      render: (_, record) => (
        <Radio
          checked={settingSelectedRowKey === record.key}
          onChange={() => handleSettingRowSelect(record.key, record)}
        />
      ),
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
    },
    {
      title: "Modulation Type",
      dataIndex: "modulation_type",
    },
    {
      title: "Symbol rate",
      dataIndex: "symbol_rate",
    },
    {
      title: "PLP",
      dataIndex: "plp",
    },
    {
      title: "PWR",
      dataIndex: "pwr",
    },
    {
      title: "Active",
      render: (_, record) => (
        <Button
          style={{ width: 20, height: 33, borderRadius: "50%" }}
          color={record.active === 1 ? "primary" : "danger"}
          variant="solid"
        />
      ),
    },
  ];

  const pmtColumn = [
    {
      title: "Service name",
      dataIndex: "service_name",
    },
    {
      title: "Under control",
      dataIndex: "under_control",
      render: (_, record) => (
        <Switch
          checked={record.under_control === 1}
          onChange={() => handlePmtSwitchChange(record.key, record)}
        />
      ),
    },
  ];

  const modulationOptions = [
    { value: "16", label: "16" },
    { value: "32", label: "32" },
    { value: "64", label: "64" },
    { value: "128", label: "128" },
    { value: "256", label: "256" },
  ];

  useEffect(() => {
    getAllDevices();
  }, [getAllDevices]);

  useEffect(() => {
    if (devices.length > 0) {
      const deviceOpts = devices.map((device) => ({
        value: device.id,
        label: device.name,
      }));
      setDevicesOptions(deviceOpts);
    }
  }, [devices]);

  const handleDeviceChange = async (value) => {
    const selectedDevice = devices.find((device) => device.id === value);
    setCurrentDevice(selectedDevice);
    await getT2SettingsByDeviceId(value);
  };

  const handleDeviceOnChange = (e) =>
    setCurrentDevice({ ...currentDevice, [e.target.name]: e.target.value });

  const handleModalOnChange = (e) =>
    setEditInput({ ...editInput, [e.target.name]: e.target.value });

  const handleModulationDropdownChange = (value) =>
    setEditInput({ ...editInput, modulation_type: value });

  const handleEditActiveChange = (checked) => {
    const newValue = checked ? 1 : 0;

    setEditInput((prev) => ({
      ...prev,
      active: newValue,
    }));
  };

  const handleEditClick = () => {
    if (settingSelectedRow.key) {
      setEditInput(settingSelectedRow);
      setOpen(true);
    } else {
      message.warning("Please select a setting you need to edit");
    }
  };

  const isValidEdit = () => {
    const MODULATION_TYPE = ["16", "32", "64", "128", "256"];
    const { modulation_type, frequency, symbol_rate, active, plp } = editInput;
    if (
      !MODULATION_TYPE.includes(modulation_type) ||
      frequency === "" ||
      symbol_rate === "" ||
      active === "" ||
      plp === "" ||
      plp.length > 1
    ) {
      return false;
    }
    const frequencyPattern = /^0[0-9]{5}$/;
    if (!frequencyPattern.test(frequency)) {
      return false;
    }
    return true;
  };

  const handleModalOk = async () => {
    if (isValidEdit()) {
      const data = {
        ...editInput,
        modulation_type: getForamtedModulationToDB(editInput.modulation_type),
        device_id: currentDevice.id,
      };
      await updateSelectedT2SettingRow(data);
    } else {
      message.error("Please input correct values");
    }
  };

  const handleConfirmDeleteClick = async () => {
    if (settingSelectedRow.key) {
      await deleteSelectedT2Setting(settingSelectedRow.key);
    } else {
      message.warning("Please select a row");
    }
  };

  const handleSave = async () => {
    if (currentDevice.id) {
      await runScript({ device_id: currentDevice.id });
    } else {
      message.error("Please select the device");
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
            style={{ color: "black" }}
            onChange={handleDeviceOnChange}
            disabled
          />
        </Col>
        <Col span={4}>
          <Input
            placeholder="Device Place"
            value={currentDevice.place}
            style={{ color: "black" }}
            onChange={handleDeviceOnChange}
            disabled
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
      <Row gutter={16} style={{ marginTop: 30 }}>
        <Col span={15}>
          <h1>DVB-T2 Settings</h1>
          <Table
            columns={settingColumn}
            dataSource={settingDataSource}
            pagination={false}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={8}>
          <h1>Programs in the multiplex</h1>
          <Table
            columns={pmtColumn}
            dataSource={pmtDataSource}
            pagination={false}
          />
        </Col>
      </Row>
      <ButtonGroup
        handleEditClick={handleEditClick}
        popLoading={popLoading}
        onDeleteClick={() => setPopOpen(true)}
        open={popOpen}
        onDeleteConfirmClick={handleConfirmDeleteClick}
        onCancel={() => setPopOpen(false)}
        onSave={handleSave}
      />
      <CustomModal
        open={open}
        confirmLoading={confirmLoading}
        handleCancel={() => {
          setOpen(false);
          setEditInput({});
        }}
        title="DVB-T2 Setting Edit"
        handleOk={handleModalOk}
      >
        <InputField
          name="frequency"
          placeholder="Frequency"
          value={editInput.frequency}
          onChange={handleModalOnChange}
          tooltip="Frequency must be a 6-digit string starting with 0 (e.g., 045000)."
        />
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 5 }}>
            <label style={{ fontSize: "1em" }}>Modulation Type</label>
          </div>
          <Dropdown
            options={modulationOptions}
            placeholder="Modulation Type"
            handleChange={handleModulationDropdownChange}
            value={editInput.modulation_type}
          />
        </div>
        <InputField
          name="symbol_rate"
          placeholder="Symbol rate"
          value={editInput.symbol_rate}
          onChange={handleModalOnChange}
        />
        <InputField
          name="plp"
          placeholder="PLP"
          value={editInput.plp}
          onChange={handleModalOnChange}
          tooltip="PLP must be a digit"
        />
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 5 }}>
            <label style={{ fontSize: "1em" }}>Active</label>
          </div>
          <Switch
            checked={editInput.active === 1}
            value={editInput.active}
            onChange={handleEditActiveChange}
          />
        </div>
      </CustomModal>
    </div>
  );
};
