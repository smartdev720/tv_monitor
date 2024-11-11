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
  updateSequence,
} from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import { Row, Col, Input, Button, Table, message } from "antd";
import {
  RightOutlined,
  DeleteRowOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const handleDeviceChange = (value) => {
    const selectedId = value.split(" ")[0];
    const selectedDevice = devices.find(
      (device) => device.id === Number(selectedId)
    );
    setCurrentDevice(selectedDevice);
    setCommandDataSource([]);
    setSequenceDataSource([]);
    setAnalogDropdownValue("");
    setSelectedSequence({});
    setSelectedSequenceKey("");
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
        value: `${device.id} ${device.place}`,
        label: `${device.id} ${device.place}`,
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
      title: `${t("serviceName")}`,
      dataIndex: "service_name",
    },
    {
      title: `${t("logo")}`,
      render: (_, record) => {
        const logoSrc = `./logos/${record.logo}.png`;

        return (
          <>
            <img
              src={logoSrc}
              alt={record.logo}
              style={{ width: 50, height: "auto" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "inline";
              }}
            />
            <img
              src="./logos/PROVENCE.png"
              alt="nologo"
              style={{ display: "none", width: 50, height: "auto" }}
            />
          </>
        );
      },
    },
  ];

  const sequence4Columns = [
    {
      title: `${t("frequency")}`,
      dataIndex: "name",
    },
  ];

  const sequence1Columns = [
    {
      title: `${t("frequency")}`,
      dataIndex: "name",
    },
  ];

  const sequence3Columns = [
    {
      title: `${t("serviceName")}`,
      dataIndex: "service_name",
    },
    {
      title: `${t("logo")}`,
      render: (_, record) => {
        const logoSrc = `./logos/${record.logo}.png`;

        return (
          <>
            <img
              src={logoSrc}
              alt={record.logo}
              style={{ width: 50, height: "auto" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "inline";
              }}
            />
            <img
              src="./logos/PROVENCE.png"
              alt="nologo"
              style={{ display: "none", width: 50, height: "auto" }}
            />
          </>
        );
      },
    },
  ];

  const sequence7Columns = [
    {
      title: `${t("serviceName")}`,
      dataIndex: "service_name",
    },
  ];

  const sequence10Columns = [
    {
      title: `${t("serviceName")}`,
      dataIndex: "service_name",
    },
  ];

  const sequenceCommandColumns = [
    {
      title: `${t("commandNumber")}`,
      dataIndex: "command_number",
    },
    {
      title: `${t("data")}`,
      dataIndex: "data",
    },
    {
      title: "STL",
      dataIndex: "stl",
      render: (stlValue, record) => (
        <Input
          name="stl"
          value={stlValue}
          onChange={(e) => handleSTLChange(e.target.value, record.key)}
          disabled={stlValue === null}
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
      message.info(t("selectDeviceValidation"));
    }
  };

  const getSequence6 = async () => {
    try {
      setLoading(true);
      const response = await fetchSequence6(currentDevice.id);
      if (response.ok) {
        setCommandColumns(sequence6Columns);
        const { data } = response;
        const dataSource = data.map((dt) => ({
          key: dt.id,
          service_name: dt.service_name,
          logo: dt.service_name,
          frequency: dt.frequency,
          name: dt.name,
        }));
        setCommandDataSource(dataSource);
      } else {
        message.error("Failed to fetch data. Please try again.");
      }
    } catch (error) {
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
            name: dt.name,
            isFrequency: true,
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
      message.info(t("selectDeviceValidation"));
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
            name: dt.name,
            isFrequency: true,
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
          logo: dt.service_name,
          name: dt.name,
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
      message.info(t("selectDeviceValidation"));
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
      setCommandNumber(value);
      getSequence7();
    } else {
      message.info(t("selectDeviceValidation"));
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
            service_name: dt.name,
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
          setTransferCommand({
            ...selectedRows[0],
            key: `${commandNumber},${selectedRows[0].key}`,
            stl: null,
          });
        } else {
          setTransferCommand({
            ...selectedRows[0],
            key: `${commandNumber},${selectedRows[0].key}`,
            stl: "",
          });
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
      label: t("analog"),
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
          data: transferCommand.isFrequency
            ? transferCommand.name
            : `${
                transferCommand.service_name
                  ? transferCommand.service_name
                  : "No service"
              }`,
          stl: transferCommand.stl,
        };
        let newSequenceDataSource;
        if (selectedSequence.key) {
          const selectedIndex = sequenceDataSource.findIndex(
            (sd) => sd.key === selectedSequence.key
          );
          newSequenceDataSource = [
            ...sequenceDataSource.slice(0, selectedIndex + 1),
            transfer,
            ...sequenceDataSource.slice(selectedIndex + 1),
          ];
        } else {
          newSequenceDataSource = [...sequenceDataSource, transfer];
        }
        setSequenceDataSource(newSequenceDataSource);
      } else {
        message.warning(t("alreadyAddedValidation"));
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
        message.warning(t("itemNotFound"));
      }
    } else {
      message.warning(t("selectItemValidation"));
    }
  };

  const handleSTLChange = (value, key) => {
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue > 64 || numericValue < 1) {
      message.warning(t("stlValidation"));
      return;
    }
    if (value.length > 2) {
      message.warning(t("stlValidation"));
      return;
    }
    setSequenceDataSource((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, stl: value } : item
      )
    );
  };

  // const addNewOne = async (data) => {
  //   try {
  //     setLoading(true);
  //     const response = await insertSequence({
  //       command_list: data,
  //       device_id: currentDevice.id,
  //     });
  //     if (response.ok) {
  //       message.success(response.message);
  //       setSequenceDataSource([]);
  //       setSelectedSequence({});
  //       setSelectedSequenceKey("");
  //       setTransferCommand({});
  //       setTransferCommandParameter("");
  //     }
  //   } catch (err) {
  //     message.error("Server error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateSequencesToDB = async (data) => {
    try {
      setLoading(true);
      const response = await updateSequence({
        command_list: data,
        device_id: currentDevice.id,
      });
      if (response.ok) {
        message.success(response.message);
        setSequenceDataSource([]);
        setSelectedSequence({});
        setSelectedSequenceKey("");
        setTransferCommand({});
        setTransferCommandParameter("");
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCommands = async () => {
    if (sequenceDataSource.length > 0) {
      const params = sequenceDataSource.map((sequence) => {
        let param = sequence.key;
        if (sequence.stl || sequence.stl === "") {
          if (sequence.stl.length === 1) {
            param += `,0${sequence.stl}`;
          } else if (sequence.stl === "") {
            param += ",00";
          } else {
            param += `,${sequence.stl}`;
          }
        }
        return param;
      });
      let data = "";
      params.forEach((param) => {
        data += ` ${param}`;
      });
      await updateSequencesToDB(data);
    } else {
      message.warning(t("sequenceSaveValidation"));
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
            placeholder={t("devices")}
            value={
              currentDevice.id
                ? `${currentDevice.id} ${currentDevice.place}`
                : t("selectDevice")
            }
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
            color={
              currentDevice.active && currentDevice.active === 1
                ? "primary"
                : "danger"
            }
            variant="solid"
          >
            {t("active")}
          </Button>
        </Col>
        <Col
          span={1}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            color={
              currentDevice.online && currentDevice.online === 1
                ? "primary"
                : "danger"
            }
            variant="solid"
          >
            Online
          </Button>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={10}>
          <h1 style={{ marginBottom: 20 }}>{t("commands")}</h1>
          <Tab
            items={tabItems}
            onChange={handleTabChange}
            activeKey={tabActiveKey}
            scroll={{
              x: 0,
              y: 500,
            }}
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
            scroll={{
              x: 0,
              y: 500,
            }}
          />
        </Col>
        <Col span={2}>
          <Button
            type="primary"
            style={{ position: "fixed", marginTop: 200 }}
            onClick={handleMove}
          >
            {t("move")}{" "}
            <RightOutlined style={{ marginLeft: 8, color: "white" }} />
          </Button>
        </Col>
        <Col span={10}>
          <h1 style={{ marginBottom: 130 }}>{t("sequence")}</h1>
          <Table
            rowSelection={{
              type: "radio",
              ...sequenceRowSelection,
            }}
            columns={sequenceCommandColumns}
            dataSource={sequenceDataSource}
            style={{ marginTop: 20 }}
            pagination={false}
            scroll={{
              x: 0,
              y: 500,
            }}
          />
        </Col>
        <Col span={2}>
          <Button
            type="primary"
            style={{ position: "fixed", marginTop: 200 }}
            onClick={handleRemove}
          >
            {t("remove")}{" "}
            <DeleteRowOutlined style={{ marginLeft: 8, color: "white" }} />
          </Button>
        </Col>
      </Row>
      <Button
        style={{ position: "fixed", bottom: 10, right: 40 }}
        type="primary"
        onClick={handleSaveCommands}
      >
        {t("save")} <SaveOutlined style={{ marginLeft: 8, color: "white" }} />
      </Button>
    </div>
  );
};
