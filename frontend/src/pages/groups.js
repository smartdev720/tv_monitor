import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Radio, Row, Table, message } from "antd";
import {
  Spinner,
  Dropdown,
  CustomModal,
  InputField,
} from "../components/common";
import {
  ArrowRightOutlined,
  DeleteRowOutlined,
  SaveOutlined,
  UsergroupAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  addNewGroup,
  deleteGroup,
  fetchAllChannels,
  fetchAllDevices,
  fetchAllGroups,
  fetchSelectedCommands,
  updateCommandList,
} from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../store/slices/devicesSlice";
import { setChannels } from "../store/slices/channelsSlice";
import {
  convertTVType,
  convertTVTypeToType,
  convertTVTypeToValue,
} from "../constant/func";
import { useTranslation } from "react-i18next";

export const Groups = () => {
  const [loading, setLoading] = useState(false);
  const [groupsDataSource, setGroupsDataSource] = useState([]);
  const [deviceOptions, setDevicesOptions] = useState([]);
  const [channelsOptions, setChannelsOptions] = useState([]);
  const [channleDropdownValue, setChannelDropdownValue] = useState("");
  const [currentDevice, setCurrentDevice] = useState({});
  const [tvTypeDropdownValue, setTvTypeDropdownValue] = useState("");
  const [commandsDataSource, setCommandsDataSource] = useState([]);
  const [groupSelectedRowKey, setGroupSelectedRowKey] = useState("");
  const [groupSelectedRow, setGroupSelectedRow] = useState({});
  const [commandSelectedRowKey, setCommandSelectedRowKey] = useState("");
  const [commandSelectedRow, setCommandSelectedRow] = useState({});
  const [selectedGroup, setSelectedGroup] = useState({});
  const [completedCommandDataSource, setCompletedCommandDataSource] = useState(
    []
  );
  const [completedCommandSelectedRowKey, setCompletedCommandSelectedRowKey] =
    useState("");
  const [completedCommandSelectedRow, setCompletedCommandSelectedRow] =
    useState({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [modalDeviceDropdownValue, setModalDeviceDropdownValue] = useState("");

  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);
  const { channels } = useSelector((state) => state.channels);
  const { t } = useTranslation();

  const handleGroupsRowSelect = (key, record) => {
    setGroupSelectedRowKey(key === groupSelectedRowKey ? null : key);
    setGroupSelectedRow(record);
    setSelectedGroup({ ...record, id: key, channel_name: record.channel });
    setCompletedCommandSelectedRow({});
    setCompletedCommandDataSource([]);
    setCompletedCommandSelectedRowKey("");
  };

  const handleCommandsRowSelect = (key, record) => {
    setCommandSelectedRowKey(key === commandSelectedRowKey ? null : key);
    setCommandSelectedRow(record);
  };

  const handleCompletedCommandsRowSelect = (key, record) => {
    setCompletedCommandSelectedRowKey(
      key === completedCommandSelectedRowKey ? null : key
    );
    setCompletedCommandSelectedRow(record);
  };

  const groupsColumn = [
    {
      title: "",
      width: 50,
      render: (_, record) => (
        <Radio
          checked={groupSelectedRowKey === record.key}
          onChange={() => handleGroupsRowSelect(record.key, record)}
        />
      ),
    },
    {
      title: "No",
      dataIndex: "no",
    },
    {
      title: `${t("groupName")}`,
      dataIndex: "name",
    },
    {
      title: `${t("channel")}`,
      dataIndex: "channel",
    },
  ];

  const commandsColumn = [
    {
      title: "",
      render: (_, record) => (
        <Radio
          checked={commandSelectedRowKey === record.key}
          onChange={() => handleCommandsRowSelect(record.key, record)}
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
      title: `${t("serviceName")}`,
      dataIndex: "service_name",
    },
  ];

  const completedCommandColumn = [
    {
      title: "",
      render: (_, record) => (
        <Radio
          checked={completedCommandSelectedRowKey === record.key}
          onChange={() => handleCompletedCommandsRowSelect(record.key, record)}
        />
      ),
    },
    {
      title: `${t("tvType")}`,
      dataIndex: "tvType",
    },
    {
      title: `${t("device")}`,
      dataIndex: "device",
    },
    {
      title: `${t("channel")}`,
      dataIndex: "channel_name",
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
      setLoading(true);
      const response = await fetchAllGroups();
      if (response.ok) {
        const { data } = response;
        console.log(data);
        const dataSource = data.map((dt, index) => ({
          key: dt.id,
          no: dt.id,
          channel: dt.channel,
          name: dt.name,
          model_id: dt.model_id,
        }));
        setGroupsDataSource(dataSource);
      }
    } catch (err) {
      message.error("Server error");
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

  const getAllChannels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllChannels();
      if (response.ok) {
        dispatch(setChannels(response.data));
      }
    } catch (err) {
      message.error("Server error");
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
        let dataSource = [];
        dataSource = data.map((dt) => ({
          key: dt.id,
          logo: dt.service_name,
          service_name: dt.service_name,
        }));
        setCommandsDataSource(dataSource);
        setCommandSelectedRow({});
        setCommandSelectedRowKey("");
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedGroup = async (id) => {
    try {
      setLoading(true);
      const response = await deleteGroup(id);
      if (response.ok) {
        const index = groupsDataSource.findIndex((ds) => ds.key === id);
        if (index !== -1) {
          const dtSource = groupsDataSource.filter((_, i) => i !== index);
          setGroupsDataSource(dtSource);
        }
        setGroupSelectedRow({});
        setGroupSelectedRowKey("");
        setCompletedCommandDataSource([]);
        setSelectedGroup({});
        message.success(response.message);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const saveCommandList = async (data) => {
    try {
      setLoading(true);
      const response = await updateCommandList(data);
      if (response.ok) {
        setCompletedCommandDataSource([]);
        setCompletedCommandSelectedRow({});
        setCompletedCommandSelectedRowKey("");
        message.success(response.message);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceChange = async (value) => {
    const selectedId = value.split(" ")[0];
    const selectedDevice = devices.find(
      (device) => device.id === Number(selectedId)
    );
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

  const handleChannelDropdown = (value) => setChannelDropdownValue(value);

  useEffect(() => {
    getAllGroups();
    getAllDevices();
    getAllChannels();
  }, [getAllDevices, getAllGroups, getAllChannels]);

  useEffect(() => {
    if (devices.length > 0) {
      const deviceOpts = devices.map((device) => ({
        value: `${device.id} ${device.place}`,
        label: `${device.id} ${device.place}`,
      }));
      setDevicesOptions(deviceOpts);
    }
  }, [devices]);

  useEffect(() => {
    if (channels.length > 0) {
      const channelOpts = channels.map((ch) => ({
        value: ch.id,
        label: ch.name,
      }));
      setChannelsOptions(channelOpts);
    }
  }, [channels]);

  const handleMove = async () => {
    if (groupSelectedRow.key && commandSelectedRow.key && currentDevice.id) {
      const deviceId = currentDevice.id.toString();
      const deviceExists = completedCommandDataSource.some((ccds) => {
        if (ccds.device.split(" ")[0] === deviceId) {
          return true;
        }
        return false;
      });
      if (!deviceExists) {
        setSelectedGroup({
          id: groupSelectedRow.key,
          channel_name: groupSelectedRow.channel,
          name: groupSelectedRow.name,
          model_id: groupSelectedRow.model_id,
          device: deviceId,
        });

        const command = {
          key: commandSelectedRow.key,
          tvType: convertTVTypeToType(tvTypeDropdownValue),
          device: `${deviceId} ${currentDevice.place}`,
          channel_name: commandSelectedRow.service_name,
        };

        setCompletedCommandDataSource((prev) => [...prev, command]);

        const updatedCommandRowDataSource = commandsDataSource.filter(
          (row) => row.key !== commandSelectedRow.key
        );
        setCommandsDataSource(updatedCommandRowDataSource);
        setCommandSelectedRow({});
      } else {
        message.warning(t("groupCommandSelectedDeviceValidation"));
      }
    } else {
      message.warning(t("groupCommandSelectRowValidation"));
    }
  };

  const handleDelete = async () => {
    if (groupSelectedRow.key) {
      await deleteSelectedGroup(groupSelectedRow.key);
    } else {
      message.warning(t("selectRowValidation"));
    }
  };

  const handleNewGroupNameChange = (e) => setNewGroupName(e.target.value);

  const handleModalDeviceChange = (value) => setModalDeviceDropdownValue(value);

  const handleModalOk = async () => {
    try {
      if (newGroupName && modalDeviceDropdownValue && channleDropdownValue) {
        setConfirmLoading(true);
        const newGroup = {
          name: newGroupName,
          model_id: modalDeviceDropdownValue,
          channel_id: channleDropdownValue,
        };
        const response = await addNewGroup(newGroup);
        if (response.ok) {
          const { data } = response;
          const dataSource = {
            key: data.id,
            no: groupsDataSource.length + 1,
            channel: data.channel,
            name: data.name,
            model_id: data.model_id,
          };
          setGroupsDataSource([...groupsDataSource, dataSource]);
          setOpen(false);
          setChannelDropdownValue("");
          setNewGroupName("");
          setModalDeviceDropdownValue("");
          message.success(t("addedSuccessfully"));
        }
      } else {
        message.warning(t("inputValidation"));
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRemove = () => {
    const updatedCompletedCommandRowDataSource =
      completedCommandDataSource.filter(
        (row) => row.key !== completedCommandSelectedRow.key
      );
    setCompletedCommandDataSource(updatedCompletedCommandRowDataSource);
  };

  const handleSave = async () => {
    if (completedCommandDataSource.length > 0 && selectedGroup.id) {
      const data = completedCommandDataSource.map((ccds) => ({
        id: selectedGroup.id,
        command_list: `${convertTVTypeToValue(ccds.tvType)},${
          ccds.device.split(" ")[0]
        },${ccds.key}`,
      }));
      let params = "";
      data.forEach((dt) => {
        params += ` ${dt.command_list}`;
      });
      await saveCommandList({ id: selectedGroup.id, command_list: params });
    } else {
      message.error(t("groupCommandSaveValidation"));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={6}>
          <h1 style={{ marginTop: 0, marginBottom: 10 }}>{t("group")}</h1>
          <Table
            columns={groupsColumn}
            dataSource={groupsDataSource}
            pagination={false}
            scroll={{
              x: 300,
              y: 500,
            }}
          />
        </Col>
        <Col span={6}>
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
                placeholder={t("devices")}
                value={
                  currentDevice.id
                    ? `${currentDevice.id} ${currentDevice.place}`
                    : t("selectDevice")
                }
              />
            </div>
            <div>
              <Dropdown
                options={tvTypeDropdownOptions}
                handleChange={handleTvTypeChange}
                placeholder={t("tvType")}
                value={tvTypeDropdownValue ? tvTypeDropdownValue : t("tvType")}
              />
            </div>
            <div>
              <h1>{t("commands")}</h1>
              <Table
                columns={commandsColumn}
                dataSource={commandsDataSource}
                pagination={false}
                scroll={{
                  x: 0,
                  y: 500,
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={2}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: 10,
            }}
          >
            <Button
              style={{ display: "block" }}
              color="primary"
              variant="solid"
              onClick={handleMove}
            >
              {t("move")}
              <ArrowRightOutlined style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </Col>
        <Col span={8}>
          <h1 style={{ marginTop: 0, marginBottom: 10 }}>{t("group")}</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {selectedGroup.id && (
              <h3>{`${selectedGroup.id} / ${selectedGroup.name} / ${selectedGroup.channel_name} / ${selectedGroup.model_id}`}</h3>
            )}
          </div>
          <Table
            columns={completedCommandColumn}
            dataSource={completedCommandDataSource}
            pagination={false}
            scroll={{
              x: 0,
              y: 500,
            }}
          />
        </Col>
        <Col span={2}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: 10,
            }}
          >
            <Button
              style={{ display: "block" }}
              color="primary"
              variant="solid"
              onClick={handleRemove}
            >
              {t("remove")}
              <DeleteRowOutlined style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </Col>
      </Row>
      <div style={{ position: "fixed", bottom: 20, right: 40 }}>
        <Button
          style={{ marginRight: 20 }}
          color="default"
          variant="solid"
          onClick={() => setOpen(true)}
        >
          {t("addNew")} <UsergroupAddOutlined style={{ marginLeft: 8 }} />
        </Button>
        <Button
          style={{ marginRight: 20 }}
          color="danger"
          variant="solid"
          onClick={handleDelete}
        >
          {t("delete")} <DeleteOutlined style={{ marginLeft: 8 }} />
        </Button>
        <Button
          style={{ marginRight: 20 }}
          color="primary"
          variant="solid"
          onClick={handleSave}
        >
          {t("save")} <SaveOutlined style={{ marginLeft: 8 }} />
        </Button>
      </div>
      <CustomModal
        open={open}
        handleCancel={() => setOpen(false)}
        confirmLoading={confirmLoading}
        title={t("addNewGroup")}
        handleOk={handleModalOk}
      >
        <InputField
          name="name"
          placeholder={t("groupName")}
          value={newGroupName}
          onChange={handleNewGroupNameChange}
          isInvalid={newGroupName === "" ? true : false}
        />
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 5 }}>
            <label style={{ fontSize: "1em" }}>{t("devices")}</label>
          </div>
          <Dropdown
            options={deviceOptions}
            handleChange={handleModalDeviceChange}
            placeholder={t("devices")}
            value={modalDeviceDropdownValue}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 5 }}>
            <label style={{ fontSize: "1em" }}>{t("channel")}</label>
          </div>
          <Dropdown
            options={channelsOptions}
            handleChange={handleChannelDropdown}
            placeholder={t("channel")}
            value={channleDropdownValue}
          />
        </div>
      </CustomModal>
    </div>
  );
};
