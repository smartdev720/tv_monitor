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
  fetchAllDevices,
  fetchCablePmtsBySettingId,
  fetchCableSettingsByDeviceId,
  runCableSettings,
  updateCablePmtsUnderControlById,
  updateSelectedCableSetting,
} from "../lib/api";
import {
  getForamtedModulationFromDB,
  getForamtedModulationToDB,
} from "../constant/func";
import { useTranslation } from "react-i18next";

export const DVBCSettings = () => {
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
  const { t } = useTranslation();

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

  const getCablePmtsBySelectedSetting = async (settingId) => {
    try {
      setLoading(true);
      const response = await fetchCablePmtsBySettingId(settingId);
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

  const getCableSettingsByDeviceId = async (deviceId) => {
    if (deviceId) {
      try {
        setLoading(true);
        const response = await fetchCableSettingsByDeviceId(deviceId);
        if (response.ok) {
          const { data } = response;
          const dataSource = data.map((dt) => ({
            key: dt.id,
            frequency: dt.frequency,
            modulation_type: getForamtedModulationFromDB(dt.modulation_type),
            symbol_rate: dt.symbol_rate,
            name: dt.name,
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

  const updateSelectedCableSettingRow = async (data) => {
    try {
      setConfirmLoading(true);
      const response = await updateSelectedCableSetting(data);
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

  const updateSelectedCablepmtsUnderControl = async (data) => {
    try {
      setLoading(true);
      const response = await updateCablePmtsUnderControlById(data);
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

  // const deleteSelectedCableSetting = async (id) => {
  //   try {
  //     setPopLoading(true);
  //     const response = await deleteCableSetting(id);
  //     if (response.ok) {
  //       setPopOpen(false);
  //       const index = settingDataSource.findIndex((ds) => ds.key === id);
  //       if (index !== -1) {
  //         const dtSource = settingDataSource.filter((_, i) => i !== index);
  //         setSettingDataSource(dtSource);
  //       }
  //       setSettingSelectedRow({});
  //       setPmtDataSource([]);
  //       setSettingSelectedRowKey("");
  //       message.success(response.message);
  //     }
  //   } catch (err) {
  //     message.error("Server error");
  //   } finally {
  //     setPopLoading(false);
  //   }
  // };

  const runScript = async (scriptParams) => {
    try {
      setLoading(true);
      const response = await runCableSettings(scriptParams);
      if (response.ok) {
        message.success(t("runScriptSuccess"));
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
    await getCablePmtsBySelectedSetting(key);
  };

  const handlePmtSwitchChange = async (key, record) => {
    const newValue = record.under_control === 1 ? 0 : 1;
    await updateSelectedCablepmtsUnderControl({ key, under_control: newValue });
  };

  const settingColumn = [
    {
      title: "",
      render: (_, record) => (
        <Radio
          checked={settingSelectedRowKey === record.key}
          onChange={() => handleSettingRowSelect(record.key, record)}
        />
      ),
    },
    {
      title: `${t("name")}`,
      dataIndex: "name",
    },
    {
      title: `${t("frequency")}`,
      dataIndex: "frequency",
    },
    {
      title: `${t("modulationType")}`,
      dataIndex: "modulation_type",
    },
    {
      title: `${t("symbolRate")}`,
      dataIndex: "symbol_rate",
    },
    {
      title: "PWR",
      dataIndex: "pwr",
    },
    {
      title: `${t("active")}`,
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
      title: `${t("serviceName")}`,
      dataIndex: "service_name",
    },
    {
      title: `${t("underControl")}`,
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
        value: `${device.id} ${device.place}`,
        label: `${device.id} ${device.place}`,
      }));
      setDevicesOptions(deviceOpts);
    }
  }, [devices]);

  const handleDeviceChange = async (value) => {
    const selectedId = value.split(" ")[0];
    const selectedDevice = devices.find(
      (device) => device.id === Number(selectedId)
    );
    setCurrentDevice(selectedDevice);
    await getCableSettingsByDeviceId(value);
  };

  // const handleDeviceOnChange = (e) =>
  //   setCurrentDevice({ ...currentDevice, [e.target.name]: e.target.value });

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
      message.warning(t("selectRowValidation"));
    }
  };

  const isValidEdit = () => {
    const MODULATION_TYPE = ["16", "32", "64", "128", "256"];
    const { modulation_type, frequency, symbol_rate, active } = editInput;
    if (
      !MODULATION_TYPE.includes(modulation_type) ||
      frequency === "" ||
      symbol_rate === "" ||
      active === ""
    ) {
      return false;
    }
    const frequencyPattern = /^(045000|[0-7][0-9]{5}|8[0-4][0-9]{4}|850000)$/;
    if (!frequencyPattern.test(frequency)) {
      return false;
    }
    if (Number(symbol_rate) < 5000 || Number(symbol_rate) > 7000) {
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
      await updateSelectedCableSettingRow(data);
    } else {
      message.error(t("inputValidation"));
    }
  };

  // const handleConfirmDeleteClick = async () => {
  //   if (settingSelectedRow.key) {
  //     await deleteSelectedCableSetting(settingSelectedRow.key);
  //   } else {
  //     message.warning("Please select a row");
  //   }
  // };

  const handleSave = async () => {
    if (currentDevice.id) {
      await runScript({ device_id: currentDevice.id });
    } else {
      message.error(t("selectDeviceValidation"));
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
            value={
              currentDevice.id
                ? `${currentDevice.id} ${currentDevice.place}`
                : t("selectDevice")
            }
          />
        </Col>
        <Col span={2}>
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
        <Col span={1}>
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
      <Row gutter={16} style={{ marginTop: 30 }}>
        <Col span={15}>
          <h1>DVB-C {t("settings")}</h1>
          <Table
            columns={settingColumn}
            dataSource={settingDataSource}
            pagination={false}
            scroll={{
              x: 0,
              y: 500,
            }}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={8}>
          <h1>{t("programsInTheMultiplex")}</h1>
          <Table
            columns={pmtColumn}
            dataSource={pmtDataSource}
            pagination={false}
            scroll={{
              x: 0,
              y: 500,
            }}
          />
        </Col>
      </Row>
      <ButtonGroup
        handleEditClick={handleEditClick}
        popLoading={popLoading}
        onDeleteClick={() => setPopOpen(true)}
        open={popOpen}
        // onDeleteConfirmClick={handleConfirmDeleteClick}
        onCancel={() => setPopOpen(false)}
        onSave={handleSave}
        isDelete={true}
        isApply={true}
      />
      <CustomModal
        open={open}
        confirmLoading={confirmLoading}
        handleCancel={() => {
          setOpen(false);
          setEditInput({});
        }}
        title={t("dvbcSettingEdit")}
        handleOk={handleModalOk}
      >
        <InputField
          name="frequency"
          placeholder={t("frequency")}
          value={editInput.frequency}
          onChange={handleModalOnChange}
          tooltip={t("frequencyPlaceHolder")}
        />
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 5 }}>
            <label style={{ fontSize: "1em" }}>{t("modulationType")}</label>
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
          placeholder={t("symbolRate")}
          value={editInput.symbol_rate}
          onChange={handleModalOnChange}
          isInvalid={
            !editInput.symbol_rate ||
            editInput.symbol_rate === "" ||
            Number(editInput.symbol_rate) < 5000 ||
            Number(editInput.symbol_rate) > 7000
              ? true
              : false
          }
        />
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 5 }}>
            <label style={{ fontSize: "1em" }}>{t("active")}</label>
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
