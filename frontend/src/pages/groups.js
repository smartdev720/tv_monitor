import React, { useCallback, useEffect, useState } from "react";
import { Col, Row, Table } from "antd";
import { Spinner, Dropdown } from "../components/common";
import {} from "@ant-design/icons";
import {
  fetchAllDevices,
  fetchAllGroups,
  fetchSelectedCommands,
} from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setDevices } from "../store/slices/devicesSlice";
import { convertTVType } from "../constant/func";

export const Groups = () => {
  const [loading, setLoading] = useState(false);
  const [groupsDataSource, setGroupsDataSource] = useState([]);
  const [deviceOptions, setDevicesOptions] = useState([]);
  const [currentDevice, setCurrentDevice] = useState({});
  const [tvTypeDropdownValue, setTvTypeDropdownValue] = useState("");
  const [commandsDataSource, setCommandsDataSource] = useState([]);

  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);

  const groupsColumn = [
    {
      title: "No",
      dataIndex: "no",
    },
    {
      title: "Channel",
      dataIndex: "channel",
    },
    {
      title: "Group name",
      dataIndex: "name",
    },
  ];

  const commandsColumn = [
    {
      title: "Logo",
      dataIndex: "logo",
    },
    {
      title: "Service name",
      dataIndex: "service_name",
    },
  ];

  const tvTypeDropdownOptions = [
    { value: "3", label: "DVB-C" },
    { value: "6", label: "DVB-T2" },
    { value: "7", label: "IPTV" },
    { value: "9", label: "Analog" },
  ];

  const getAllGroups = useCallback(async () => {
    try {
      setLoading(false);
      const response = await fetchAllGroups();
      if (response.ok) {
        const { data } = response;
        // dispatch(setGroups(data));
        const dataSource = data.map((dt, index) => ({
          key: dt.id,
          no: index + 1,
          channel: dt.channel,
          name: dt.name,
        }));
        setGroupsDataSource(dataSource);
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  }, []);

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

  const getSelectedCommands = async (tvType, deviceId) => {
    try {
      setLoading(true);
      const response = await fetchSelectedCommands({
        tvTable: tvType,
        device_id: deviceId,
      });
      if (response.ok) {
        const { data } = response;
        const dataSource = data.map((dt) => ({
          key: dt.id,
          logo: dt.logo ? dt.logo : "No logo",
          service_name: dt.service_name,
        }));
        setCommandsDataSource(dataSource);
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceChange = async (value) => {
    const selectedDevice = devices.find((device) => device.id === value);
    setCurrentDevice(selectedDevice);
    if (tvTypeDropdownValue) {
      await getSelectedCommands(convertTVType(tvTypeDropdownValue), value);
    }
  };

  const handleTvTypeChange = async (value) => {
    setTvTypeDropdownValue(value);
    if (currentDevice.id) {
      await getSelectedCommands(convertTVType(value), currentDevice.id);
    }
  };

  useEffect(() => {
    getAllGroups();
    getAllDevices();
  }, [getAllDevices, getAllGroups]);

  useEffect(() => {
    if (devices.length > 0) {
      const deviceOpts = devices.map((device) => ({
        value: device.id,
        label: device.id,
      }));
      setDevicesOptions(deviceOpts);
    }
  }, [devices]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={8}>
          <h1 style={{ marginTop: 0, marginBottom: 10 }}>Groups</h1>
          <Table
            columns={groupsColumn}
            dataSource={groupsDataSource}
            pagination={false}
          />
        </Col>
        <Col span={8}>
          <div
            style={{
              width: "100%",
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 10,
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <Dropdown
                options={deviceOptions}
                handleChange={handleDeviceChange}
                placeholder="Devices"
                value={currentDevice.id}
              />
            </div>
            <div>
              <Dropdown
                options={tvTypeDropdownOptions}
                handleChange={handleTvTypeChange}
                placeholder="TV Type"
                value={tvTypeDropdownValue}
              />
            </div>
            <div>
              <h1>Commands</h1>
              <Table
                columns={commandsColumn}
                dataSource={commandsDataSource}
                pagination={false}
              />
            </div>
          </div>
        </Col>
        <Col span={8}></Col>
      </Row>
    </div>
  );
};
