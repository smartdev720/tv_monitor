import React, { useState, useCallback, useEffect } from "react";
import { Row, Col, Button, Table, Progress, Radio, message } from "antd";
import {
  CustomModal,
  Dropdown,
  InputField,
  Spinner,
  VideoPlayer,
} from "../components/common";
import {
  fetchAllDevices,
  fetchAnalogSettingsByDeviceId,
  runAnalogSettings,
  updateAnalogSetting,
} from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import { EditOutlined, SendOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

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
  const [videoSrc, setVideoSrc] = useState("");

  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);
  const { t } = useTranslation();

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
        value: `${device.id} ${device.place}`,
        label: `${device.id} ${device.place}`,
      }));
      setDevicesOptions(deviceOpts);
    }
  }, [devices]);

  const handleDeviceChange = async (value) => {
    try {
      setLoading(true);
      const selectedId = value.split(" ")[0];
      const selectedDevice = devices.find(
        (device) => device.id === Number(selectedId)
      );
      setCurrentDevice(selectedDevice);
      const response = await fetchAnalogSettingsByDeviceId(selectedId);
      if (response.ok) {
        const { data } = response;
        const ds = data.map((dt) => ({
          key: dt.id,
          logo: dt.program_name,
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

  const updateOne = async (data) => {
    try {
      setConfirmLoading(true);
      const response = await updateAnalogSetting(data);
      if (response.ok) {
        setDataSource((prevData) =>
          prevData.map((item) =>
            item.key === data.key
              ? {
                  ...item,
                  active: Number(data.active),
                  frequency: data.frequency,
                  program_name: data.program_name,
                  standart: data.standart,
                  logo: data.logo,
                }
              : item
          )
        );
        setOpen(false);
        setEditInput(data);
        setSelectedRow(data);
        message.success(response.message);
      }
    } catch (err) {
    } finally {
      setConfirmLoading(false);
    }
  };

  const runScript = async (scriptParams) => {
    try {
      setLoading(true);
      const response = await runAnalogSettings(scriptParams);
      if (response.ok) {
        message.success("Run script successfully");
        setVideoSrc("/9/1365.mp4");
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: `${t("select")}`,
      render: (_, record) => (
        <Radio
          checked={selectedRowKey === record.key}
          onChange={() => handleRowSelect(record.key, record)}
        />
      ),
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
    {
      title: `${t("programName")}`,
      dataIndex: "program_name",
      editable: true,
    },
    {
      title: `${t("frequency")}`,
      dataIndex: "frequency",
      editable: true,
    },
    {
      title: `${t("standart")}`,
      dataIndex: "standart",
      editable: true,
    },
    {
      title: `${t("active")}`,
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

    const frequencyPattern = /^(045000|[0-7][0-9]{5}|8[0-4][0-9]{4}|850000)$/;
    if (!frequencyPattern.test(frequency)) {
      errors.frequency = t("frequencyPlaceHolder");
    }

    const validStandards = ["0", "1", "2", "3", "4"];
    if (!validStandards.includes(standard)) {
      errors.standard = t("standartValidation");
    }

    if (!programName || programName.trim() === "") {
      errors.programName = t("programNameValidation");
    }

    return errors;
  };

  const handleEditChange = (e) =>
    setEditInput({ ...editInput, [e.target.name]: e.target.value });

  const handleEdit = () => {
    if (selectedRow.key) {
      setOpen(true);
      setEditInput({ ...selectedRow, logo: selectedRow.logo.split("/")[1] });
      setStandartDropdownValue(selectedRow.standart);
      setActiveDropdownValue(selectedRow.active);
    } else {
      message.warning(t("selectRowValidation"));
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
        message.error(t("inputValidation"));
      } else {
        const transferedData = {
          ...editInput,
          key: editInput.key,
          logo: editInput.program_name,
          program_name: editInput.program_name,
          active: activeDropdownValue,
          standart: standartDropdownValue,
          frequency: editInput.frequency,
        };
        await updateOne(transferedData);
      }
    } catch (err) {
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleApply = async () => {
    if (currentDevice.id && selectedRow.key) {
      const data = {
        device_id: currentDevice.id,
        frequency: selectedRow.frequency,
        standart: selectedRow.standart,
      };
      await runScript(data);
    } else if (!currentDevice.id) {
      message.error(t("selectDeviceValidation"));
    } else {
      message.error(t("selectRowValidation"));
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
      <div style={{ marginTop: 20, height: "70vh", overflowX: "hidden" }}>
        <Row gutter={16}>
          <Col span={16}>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              scroll={{
                x: 0,
                y: 500,
              }}
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
              <VideoPlayer videoSrc={videoSrc} />
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
                {t("edit")}
              </Button>
              <Button
                icon={<SendOutlined />}
                iconPosition="end"
                variant="solid"
                color="primary"
                style={{ marginLeft: 20 }}
                onClick={handleApply}
              >
                {t("apply")}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      <CustomModal
        open={open}
        handleCancel={() => setOpen(false)}
        title={t("analogSettingEdit")}
        confirmLoading={confirmLoading}
        handleOk={handleEditOk}
      >
        <div style={{ marginTop: 30 }}>
          <InputField
            name="frequency"
            placeholder={t("frequency")}
            value={editInput.frequency}
            tooltip={t("frequencyPlaceHolder")}
            onChange={handleEditChange}
          />
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 5 }}>
              <label style={{ fontSize: "1em" }}>{t("standart")}</label>
            </div>
            <Dropdown
              options={standartDropdownOptions}
              placeholder={`${t("standart")}`}
              handleChange={handleStandartChange}
              value={standartDropdownValue}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 5 }}>
              <label style={{ fontSize: "1em" }}>{t("active")}</label>
            </div>
            <Dropdown
              options={activeDropdownOptions}
              placeholder={`${t("active")}`}
              handleChange={handleActiveChange}
              value={activeDropdownValue}
            />
          </div>
          <InputField
            name="program_name"
            placeholder={`${t("programName")}`}
            value={editInput.program_name}
            onChange={handleEditChange}
            isInvalid={
              editInput.program_name === "" || !editInput.program_name
                ? true
                : false
            }
          />
        </div>
      </CustomModal>
    </div>
  );
};
