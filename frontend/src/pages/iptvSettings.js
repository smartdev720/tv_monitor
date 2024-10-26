import React, { useState, useCallback, useEffect, act } from "react";
import { Button, Col, Input, Radio, Row, Switch, Table, message } from "antd";
import {
  ButtonGroup,
  CustomModal,
  Dropdown,
  InputField,
  Spinner,
  VideoPlayer,
} from "../components/common";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import {
  fetchAllDevices,
  fetchIPTVSettingsByDeviceId,
  updateIPTVSetting,
  deleteIPTVSetting,
  runIPTVSettings,
} from "../lib/api";
import { formatDeviceId } from "../constant/func";

export const IPTVSettings = () => {
  const [loading, setLoading] = useState(false);
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [currentDevice, setCurrentDevice] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedRowKey, setSelectedRowKey] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [editInput, setEditInput] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
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

  const getIPTVSettingsByDeviceId = async (deviceId) => {
    try {
      setLoading(true);
      const response = await fetchIPTVSettingsByDeviceId(deviceId);
      if (response.ok) {
        const { data } = response;
        const dtSource = data.map((dt) => ({
          key: dt.id,
          name: dt.name,
          url: dt.url,
          active: dt.active,
        }));
        setDataSource(dtSource);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const updateSelectedITPVSetting = async (data) => {
    try {
      setConfirmLoading(true);
      const response = await updateIPTVSetting(data);
      if (response.ok) {
        setDataSource((prevData) =>
          prevData.map((item) =>
            item.key === data.key ? { ...item, ...data } : item
          )
        );
        setSelectedRow(data);
        setSelectedRowKey(data.key);
        setEditInput({});
        message.success(response.message);
        setOpen(false);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setConfirmLoading(false);
    }
  };

  const deleteSelectedIPTVSetting = async (id) => {
    try {
      setPopLoading(true);
      const response = await deleteIPTVSetting(id);
      if (response.ok) {
        setPopOpen(false);
        const index = dataSource.findIndex((ds) => ds.key === id);
        if (index !== -1) {
          const dtSource = dataSource.filter((_, i) => i !== index);
          setDataSource(dtSource);
        }
        setSelectedRow({});
        setSelectedRowKey("");
        message.success(response.message);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setPopLoading(false);
    }
  };

  const runScript = async (params) => {
    try {
      setLoading(true);
      debugger;
      const response = await runIPTVSettings(params);
      if (response.ok) {
        console.log(response.message);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////

  const handleDeviceChange = async (value) => {
    const selectedDevice = devices.find((device) => device.id === value);
    setCurrentDevice(selectedDevice);
    await getIPTVSettingsByDeviceId(value);
  };

  const handleRowSelect = async (key, record) => {
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Url",
      dataIndex: "url",
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

  const handleModalOnChange = (e) =>
    setEditInput({ ...editInput, [e.target.name]: e.target.value });

  const handleEditActiveChange = (checked) => {
    const newValue = checked ? 1 : 0;
    setEditInput((prev) => ({
      ...prev,
      active: newValue,
    }));
  };

  const handleEditClick = () => {
    if (selectedRow.key) {
      setEditInput(selectedRow);
      setOpen(true);
    } else {
      message.warning("Please select a setting you need to edit");
    }
  };

  const isValidEdit = () => {
    const { name, url, active } = editInput;
    if (name === "" || url === "" || active === "") {
      return false;
    }
    return true;
  };

  const handleModalOk = async () => {
    if (isValidEdit()) {
      await updateSelectedITPVSetting(editInput);
    } else {
      message.warning("Please input correct values");
    }
  };

  const handleConfirmDeleteClick = async () => {
    if (selectedRow.key) {
      await deleteSelectedIPTVSetting(selectedRow.key);
    } else {
      message.warning("Please select the row");
    }
  };

  const handleSave = async () => {
    if (currentDevice.id && selectedRow.key) {
      const scriptParams = [
        7,
        formatDeviceId(currentDevice.id),
        selectedRow.key,
      ];
      await runScript(scriptParams);
    } else {
      message.warning(
        "Please select the device and IPTV setting row on the table"
      );
    }
  };

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
            disabled
          />
        </Col>
        <Col span={4}>
          <Input
            placeholder="Device Place"
            value={currentDevice.place}
            style={{ color: "black" }}
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
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        </Col>
        <Col span={1}></Col>
        <Col span={8}>
          <VideoPlayer />
          <ButtonGroup
            handleEditClick={handleEditClick}
            popLoading={popLoading}
            onDeleteClick={() => setPopOpen(true)}
            open={popOpen}
            onDeleteConfirmClick={handleConfirmDeleteClick}
            onCancel={() => setPopOpen(false)}
            onSave={handleSave}
          />
        </Col>
      </Row>
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
          name="name"
          placeholder="Name"
          value={editInput.name}
          onChange={handleModalOnChange}
        />
        <InputField
          name="url"
          placeholder="Url"
          value={editInput.url}
          onChange={handleModalOnChange}
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
