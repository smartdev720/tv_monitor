import React, { useCallback, useEffect, useState } from "react";
import { Dropdown, Spinner, Tab } from "../components/common";
import {
  fetchAllDevices,
  fetchSequence3,
  fetchSequence4,
  fetchSequence6,
  fetchSequence7,
  fetchSequence10,
  fetchSequence1,
  insertSequence,
} from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import { setSequence6 } from "../store/slices/sequence6Slice";
import { Row, Col, Input, Button, Table, message, Radio } from "antd";
import {
  RightOutlined,
  DeleteRowOutlined,
  SaveOutlined,
} from "@ant-design/icons";

export const Sequence = () => {
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDevice, setCurrentDevice] = useState({});
  const [commandColumns, setCommandColumns] = useState([]);
  const [commandDataSource, setCommandDataSource] = useState([]);
  const [sequenceDataSource, setSequenceDataSource] = useState([]);
  const [dbt2DropdownValue, setDVT2DropdownValue] = useState("");
  const [dbcDropdownValue, setDVCDropdownValue] = useState("");
  const [analogDropdownValue, setAnalogDropdownValue] = useState("");
  const [iptvDropdownValue, setIPTVDropdownValue] = useState("");
  const [tabActiveKey, setTabActiveKey] = useState("1");
  const [commandNumber, setCommandNumber] = useState("");
  const [transferCommand, setTransferCommand] = useState({});
  const [transferCommandParameter, setTransferCommandParameter] = useState("");
  const [selectedSequence, setSelectedSequence] = useState({});
  const [selectedSequenceKey, setSelectedSequenceKey] = useState({});

  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);

  const handleDeviceChange = (value) => {
    const selectedDevice = devices.find((device) => device.id === value);
    setCurrentDevice(selectedDevice);
    setCommandDataSource([]);
    setSequenceDataSource([]);
    setAnalogDropdownValue("");
    setDVT2DropdownValue("");
    setDVCDropdownValue("");
    setIPTVDropdownValue("");
  };

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

  const handleTabChange = (e) => setTabActiveKey(e);

  const dvbt2DropdownItems = [
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
  ];

  const dvbcDropdownItems = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ];

  const analogDropdownItems = [
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];

  const sequence6Columns = [
    {
      title: "Service Name",
      dataIndex: "service_name",
    },
    {
      title: "Logo",
      dataIndex: "channel_logo",
    },
  ];

  const sequence4Columns = [
    {
      title: "Frequency",
      dataIndex: "frequency",
    },
  ];

  const sequence1Columns = [
    {
      title: "Frequency",
      dataIndex: "frequency",
    },
  ];

  const sequence3Columns = [
    {
      title: "Service Name",
      dataIndex: "service_name",
    },
    {
      title: "Logo",
      dataIndex: "logo",
    },
  ];

  const sequence7Columns = [
    {
      title: "IPTV Setting Name",
      dataIndex: "setting_name",
    },
  ];

  const sequence10Columns = [
    {
      title: "Service Name",
      dataIndex: "service_name",
    },
  ];

  const handleSequenceRowSelect = async (key, record) => {
    setSelectedSequenceKey(key === selectedSequenceKey ? null : key);
    setSelectedSequence(record);
  };

  const sequenceCommandColumns = [
    {
      title: "Select",
      render: (_, record) => (
        <Radio onChange={() => handleSequenceRowSelect(record.key, record)} />
      ),
    },
    {
      title: "Command Number",
      dataIndex: "command_number",
    },
    {
      title: "Data",
      dataIndex: "data",
    },
    {
      title: "STL",
      dataIndex: "stl",
      render: (_, record) => (
        <Input
          name="stl"
          onChange={handleSTLChange}
          disabled={record === null}
          style={{ border: "none", outline: "none" }}
        />
      ),
    },
  ];

  const iptvDropdownItems = [{ value: "7", label: "7" }];

  const handleDVBT2DropdownChange = async (value) => {
    if (currentDevice.id) {
      setDVT2DropdownValue(value);
      setCommandNumber(value);
      setSequenceDataSource([]);
      switch (value) {
        case "4":
          getSequence4();
          break;
        case "5":
          getSequence4();
          break;
        case "6":
          getSequence6();
          break;
        default:
          return;
      }
    } else {
      message.info("Please select the available device");
    }
  };

  const getSequence6 = async () => {
    try {
      setLoading(true);
      const response = await fetchSequence6(currentDevice.id);
      if (response.ok) {
        setCommandColumns(sequence6Columns);
        debugger;
        const { data } = response;
        dispatch(setSequence6(data));

        const dataSource = data.map((dt) => ({
          key: dt.id,
          service_name: dt.service_name,
          channel_logo: dt.logo ? dt.logo : "No logo",
          frequency: dt.frequency,
        }));
        setCommandDataSource(dataSource);
      } else {
        message.error("Failed to fetch data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching sequence 6:", error);
      message.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const getSequence4 = async () => {
    try {
      setLoading(true);
      const response = await fetchSequence4(currentDevice.id);
      if (response.ok) {
        setCommandColumns(sequence4Columns);
        const { data } = response;
        const dataSource = [];
        data.forEach((dt) => {
          dataSource.push({
            key: dt.id,
            frequency: dt.frequency,
            service_name: dt.service_name,
            t2_setting_id: dt.t2_setting_id,
          });
        });
        setCommandDataSource(dataSource);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDVBCDropdownChange = (value) => {
    if (currentDevice.id) {
      setDVCDropdownValue(value);
      setCommandNumber(value);
      switch (value) {
        case "1":
          getSequence1();
          break;
        case "2":
          getSequence1();
          break;
        case "3":
          getSequence3();
          break;
        default:
          return;
      }
    } else {
      message.info("Please select the available device");
    }
  };

  const getSequence1 = async () => {
    try {
      setLoading(true);
      const response = await fetchSequence1(currentDevice.id);
      if (response.ok) {
        setCommandColumns(sequence1Columns);
        const { data } = response;
        const dataSource = [];
        data.forEach((dt) => {
          dataSource.push({
            key: dt.id,
            frequency: dt.frequency,
            service_name: dt.service_name,
          });
        });
        setCommandDataSource(dataSource);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const getSequence3 = async () => {
    try {
      setLoading(true);
      const response = await fetchSequence3(currentDevice.id);
      if (response.ok) {
        setCommandColumns(sequence3Columns);
        const { data } = response;
        const dataSource = data.map((dt) => ({
          key: dt.id,
          service_name: dt.service_name ? dt.service_name : "No service",
          frequency: dt.frequency,
          logo: dt.logo ? dt.logo : "No logo",
        }));
        setCommandDataSource(dataSource);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalogDropdownChange = (value) => {
    if (currentDevice.id) {
      setAnalogDropdownValue(value);
      setCommandNumber(value);
      getSequence10();
    } else {
      message.info("Please select the available device");
    }
  };

  const getSequence10 = async () => {
    try {
      setLoading(true);
      const response = await fetchSequence10(currentDevice.id);
      if (response.ok) {
        setCommandColumns(sequence10Columns);
        const { data } = response;
        const dataSource = [];
        data.forEach((dt) => {
          dataSource.push({
            key: dt.id,
            service_name: dt.program_name,
            frequency: dt.frequency,
          });
        });
        setCommandDataSource(dataSource);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleIPTVDropdownChange = (value) => {
    if (currentDevice.id) {
      setIPTVDropdownValue(value);
      setSequenceDataSource([]);
      setCommandNumber(value);
      getSequence7();
    } else {
      message.info("Please select the available device");
    }
  };

  const getSequence7 = async () => {
    try {
      setLoading(true);
      const response = await fetchSequence7(currentDevice.id);
      if (response.ok) {
        setCommandColumns(sequence7Columns);
        const { data } = response;
        const dataSource = [];
        data.forEach((dt) => {
          dataSource.push({
            key: dt.id,
            setting_name: dt.name,
          });
        });
        setCommandDataSource(dataSource);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const commandRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length > 0) {
        const command = `${commandNumber},${selectedRows[0].key}`;
        setTransferCommandParameter(command);
        if (
          commandNumber === "1" ||
          commandNumber === "4" ||
          commandNumber === "5" ||
          commandNumber === "8"
        ) {
          setTransferCommand(selectedRows[0]);
        } else {
          setTransferCommand({ ...selectedRows[0] });
        }
      }
    },
  };

  const sequenceRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length > 0) {
        setSelectedSequence(selectedRows[0]);
      }
    },
  };

  const tabItems = [
    {
      key: "1",
      label: "DVB-T2",
      children: (
        <Dropdown
          options={dvbt2DropdownItems}
          handleChange={handleDVBT2DropdownChange}
          placeholder="DVB-T2"
          value={dbt2DropdownValue}
        />
      ),
    },
    {
      key: "2",
      label: "DVB-C",
      children: (
        <Dropdown
          options={dvbcDropdownItems}
          handleChange={handleDVBCDropdownChange}
          placeholder="DVB-C"
          value={dbcDropdownValue}
        />
      ),
    },
    {
      key: "3",
      label: "Analog",
      children: (
        <Dropdown
          options={analogDropdownItems}
          handleChange={handleAnalogDropdownChange}
          placeholder="Analog"
          value={analogDropdownValue}
        />
      ),
    },
    {
      key: "4",
      label: "IPTV",
      children: (
        <Dropdown
          options={iptvDropdownItems}
          handleChange={handleIPTVDropdownChange}
          placeholder="IPTV"
          value={iptvDropdownValue}
        />
      ),
    },
  ];

  const handleMove = () => {
    if (transferCommandParameter && transferCommand.key && commandNumber) {
      if (!sequenceDataSource.some((sd) => sd.key === transferCommand.key)) {
        const transfer = {
          key: transferCommand.key,
          command_number: commandNumber,
          data: `${
            transferCommand.service_name
              ? transferCommand.service_name
              : "No service"
          } ${
            transferCommand.frequency
              ? transferCommand.frequency
              : "No frequency"
          }`,
        };
        setSequenceDataSource([...sequenceDataSource, transfer]);
      } else {
        message.warning("You have already added");
      }
    }
  };

  const handleRemove = () => {
    if (selectedSequence.key) {
      const index = sequenceDataSource.findIndex(
        (sd) => sd.key === selectedSequence.key
      );

      if (index !== -1) {
        const newSequenceDataSource = [...sequenceDataSource];
        newSequenceDataSource.splice(index, 1);
        setSequenceDataSource(newSequenceDataSource);
      } else {
        message.warning("Item not found");
      }
    } else {
      message.warning("Please select an item to remove");
    }
  };

  const handleSTLChange = (value, key) => {
    if (Number(value) > 64 || Number(value) < 0) {
      message.warning("Please input the STL between 1 and 64");
      return;
    } else if (value.length > 2) {
      message.warning("Please input correct STL.");
      return;
    }
    setSequenceDataSource((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, stl: value } : item
      )
    );
  };

  const addNewOne = async (data) => {
    try {
      setLoading(true);
      const response = await insertSequence({ command_list: data });
      if (response.ok) {
        message.success(response.message);
        setSequenceDataSource([]);
        setSelectedSequence({});
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCommands = async () => {
    let datas = "";
    if (
      commandNumber === "1" ||
      commandNumber === "4" ||
      commandNumber === "5" ||
      commandNumber === "8"
    ) {
      datas = sequenceDataSource.map((sd) => `${commandNumber}, ${sd.key}`);
      console.log(datas);
    } else {
      datas = sequenceDataSource.map(
        (sd) =>
          `${commandNumber},${sd.key},${
            sd.stl.length === 1 ? `0${sd.stl}` : sd.stl
          }`
      );
      await addNewOne(datas);
    }
  };

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
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={10}>
          <h1 style={{ marginBottom: 20 }}>Commands</h1>
          <Tab
            items={tabItems}
            onChange={handleTabChange}
            activeKey={tabActiveKey}
          />
          <Table
            rowSelection={{
              type: "radio",
              ...commandRowSelection,
            }}
            columns={commandColumns}
            dataSource={commandDataSource}
            style={{ marginTop: 20 }}
            pagination={false}
          />
        </Col>
        <Col
          span={2}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            style={{ display: "flex", alignItems: "center" }}
            onClick={handleMove}
          >
            Move <RightOutlined style={{ marginLeft: 8, color: "white" }} />
          </Button>
        </Col>
        <Col span={10}>
          <h1 style={{ marginBottom: 130 }}>Sequence</h1>
          <Table
            rowSelection={{
              type: "radio",
              ...sequenceRowSelection,
            }}
            columns={sequenceCommandColumns}
            dataSource={sequenceDataSource}
            style={{ marginTop: 20 }}
            pagination={false}
          />
        </Col>
        <Col
          span={2}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            style={{ display: "flex", alignItems: "center" }}
            onClick={handleRemove}
          >
            Remove{" "}
            <DeleteRowOutlined style={{ marginLeft: 8, color: "white" }} />
          </Button>
        </Col>
      </Row>
      <Button
        style={{ position: "fixed", bottom: 10, right: 40 }}
        type="primary"
        onClick={handleSaveCommands}
      >
        Save <SaveOutlined style={{ marginLeft: 8, color: "white" }} />
      </Button>
    </div>
  );
};
