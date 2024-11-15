import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  message,
  Radio,
  Row,
  Table,
  Tooltip,
} from "antd";
import {
  CompareFrame,
  CustomModal,
  Dropdown,
  NumberField,
  Spinner,
} from "../components/common";
import {
  fetchAllGroups,
  fetchDat99ByGroupIdAndDate,
  fetchDat99ResByCnt,
  getFileNamesFromBackend,
} from "../lib/api/groups";
import { setGroups } from "../store/slices/groupSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  formatDelay,
  formatTime,
  getDateWithISO,
  parseTime,
} from "../constant/func";
import { useGlobal } from "../lib/globalFunc";
import { useTranslation } from "react-i18next";
import { updateExtGroupVal } from "../lib/api";

export const Compare = () => {
  const [groupOptions, setGroupOptions] = useState([]);
  const [groupDropdownValue, setGroupDropdownValue] = useState("");
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedRowKey, setSelectedRowKey] = useState("");
  const [compareData, setCompareData] = useState([]);
  const [leaderId, setLeaderId] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalInput, setModalInput] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [badGroups, setBadGroups] = useState([]);

  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.groups);
  const { devices } = useSelector((state) => state.devices);
  const { user } = useSelector((state) => state.user);
  const { t } = useTranslation();

  const { getBadData, getGroupByBadDataCnt, getDevicesById } = useGlobal();

  // Table columns
  const columns = [
    {
      title: "",
      width: 100,
      render: (_, record) => (
        <Radio
          checked={selectedRowKey === record.key}
          onChange={() => handleRowSelect(record.key, record)}
        />
      ),
    },
    {
      title: `${t("time")}`,
      dataIndex: "time",
    },
  ];
  ////////////////////////////////////////

  // Interact with backend
  const getAllGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllGroups();
      if (response.ok) {
        const { data } = response;
        dispatch(setGroups(data));
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  const getDat99ByGroupIdAndDate = async (odata) => {
    try {
      setLoading(true);
      const response = await fetchDat99ByGroupIdAndDate(odata);
      if (response.ok) {
        const { data } = response;
        const dSource = data.map((dt) => {
          let time = "";
          if (dt.time_cmd) {
            const dateObj = new Date(dt.time_cmd);
            const localDate = new Date(
              dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
            );
            time = localDate.toISOString().split("T")[1].split(".")[0];
          } else {
            time = "No time";
          }
          return {
            key: dt.cnt,
            time: time,
          };
        });
        setDataSource(dSource);
        setSelectedRow({});
        setSelectedRowKey("");
        setCompareData([]);
      }
    } catch (err) {
      message.error(t("badRequest"));
    } finally {
      setLoading(false);
    }
  };

  const getDat99ResByCnt = async (cnt, selectedRow) => {
    try {
      setLoading(true);
      const response = await fetchDat99ResByCnt(cnt);
      if (response.ok) {
        const cData = await Promise.all(
          response.data.map(async (dt) => {
            const selectedDevice = devices.find(
              (device) => device.id === dt.device_id
            );
            if (selectedDevice) {
              const imgs = await getFileNames(cnt, selectedDevice);
              const startSeconds = parseTime(selectedRow.time);
              const formattedDelay = formatDelay(dt.delay);
              const imgsWithTime = imgs.map((img, index) => {
                const currentTime = formatTime(startSeconds + 5 * index);
                return { src: img, time: currentTime };
              });
              const result = {
                deviceId: selectedDevice.id,
                devicePlace: selectedDevice.place,
                delay: formattedDelay,
                imgs: imgsWithTime,
              };
              if (dt.delay >= 1000 || dt.delay <= -1000) {
                result.isDelayed = true;
              }

              return result;
            }
            return null;
          })
        );
        const ccData = cData.filter((cd) => cd !== null);
        const leader = ccData.find((ccd) => ccd.deviceId === Number(leaderId));
        const others = cData.filter(
          (item) => item !== null && item.deviceId !== Number(leaderId)
        );
        setCompareData(leader ? [leader, ...others] : others);
        setLeaderId(null);
      }
    } catch (err) {
      message.error(t("badRequest"));
    } finally {
      setLoading(false);
    }
  };

  const getFileNames = async (cnt, device) => {
    try {
      setLoading(true);
      const response = await getFileNamesFromBackend(cnt, device.id);
      if (response.ok) {
        const imgs = response.data.map(
          (dt) => `http://localhost:5000/compare/${cnt}/${device.id}/${dt}`
        );
        return imgs;
      }
    } catch (err) {
      message.error(t("filesNotFound"));
    } finally {
      setLoading(false);
    }
  };
  ////////////////////////////////////////

  // Handle changes
  const handleGroupDropdownChange = async (value) => {
    setGroupDropdownValue(value);
    const leaderId = value.split(" ")[1];
    setLeaderId(leaderId);
    if (date) {
      const formattedDate = getDateWithISO(date);
      const badData = await getBadData(formattedDate);
      const bGroups = await Promise.all(
        badData.map(async (bd) => {
          const group = await getGroupByBadDataCnt(bd.cnt);
          if (group) {
            return group;
          }
        })
      );
      setBadGroups(bGroups);
      await getDat99ByGroupIdAndDate({
        id: value.split(" ")[0],
        date: formattedDate,
      });
    }
  };

  const handleDatePickerChange = async (date) => {
    setDate(date);
    if (date && groupDropdownValue !== "") {
      const formattedDate = getDateWithISO(date);
      const badData = await getBadData(formattedDate);
      const bGroups = await Promise.all(
        badData.map(async (bd) => {
          const group = await getGroupByBadDataCnt(bd.cnt);
          if (group) {
            return group;
          }
        })
      );
      setBadGroups(bGroups);
      await getDat99ByGroupIdAndDate({
        id: groupDropdownValue.split(" ")[0],
        date: formattedDate,
      });
    }
  };

  const handleRowSelect = async (key, record) => {
    setSelectedRowKey(key === selectedRowKey ? null : key);
    setSelectedRow(record);
    await getDat99ResByCnt(key, record);
  };

  const handleModalInputChange = (name, value) => {
    setModalInput({ ...modalInput, [name]: value });
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const data = {
        ...modalInput,
        settingId: groupDropdownValue.split(" ")[0],
        userId: user.id,
      };
      const response = await updateExtGroupVal(data);
      if (response.ok) {
        message.success(response.message);
        setModal(false);
        setModalInput({});
      }
    } catch (err) {
      message.error(t("badRequest"));
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////

  // Hooks

  useEffect(() => {
    getAllGroups();
  }, [getAllGroups]);

  useEffect(() => {
    const fetchAllSettings = async () => {
      if (user && user.id) {
        await getDevicesById(user.locations);
      }
    };
    fetchAllSettings();
  }, [user]);

  useEffect(() => {
    if (groups.length > 0) {
      const options = groups.map((group) => {
        const isBadGroup = badGroups.some((bd) => bd.id === group.id);
        return {
          value: `${group.id} ${group.model_id} ${group.name}`,
          label: `${group.id} ${group.name}`,
          style: isBadGroup ? { color: "red" } : undefined,
        };
      });

      setGroupOptions(options);
    }
  }, [groups, badGroups, setGroupOptions]);

  useEffect(() => {
    const fetchBadData = async () => {
      try {
        const date = new Date().toISOString().split("T")[0];
        const badData = await getBadData(date);
        const bGroups = await Promise.all(
          badData.map(async (bd) => {
            const group = await getGroupByBadDataCnt(bd.cnt);
            if (group) {
              return group;
            }
          })
        );
        setBadGroups(bGroups);
      } catch (err) {
        message.error(t("badRequest"));
      }
    };
    fetchBadData();
  }, []);
  ////////////////////////////////////////

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={4}>
          <Dropdown
            options={groupOptions}
            value={
              groupDropdownValue !== "" ? groupDropdownValue : t("selectGroup")
            }
            handleChange={handleGroupDropdownChange}
          />
        </Col>
        <Col span={4}>
          <DatePicker
            style={{ display: "block" }}
            onChange={handleDatePickerChange}
            value={date}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={3}></Col>
        <Col span={1} style={{ marginLeft: 20 }}>
          <Tooltip placement="rightTop" title="Configuring notifications">
            <Button type="link" onClick={() => setModal(true)}>
              <img src="./notify.svg" alt="notify" />
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={4}>
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
        <Col span={20}>
          {compareData.length > 0 ? (
            compareData.map((cd) => (
              <CompareFrame imgs={cd.imgs ? cd.imgs : []} data={cd} />
            ))
          ) : (
            <h3 style={{ color: "white", textAlign: "center" }}>
              {t("noComparisonData")}
            </h3>
          )}
        </Col>
      </Row>
      <CustomModal
        isSave={true}
        title={t("notifyOption")}
        open={modal}
        handleCancel={() => setModal(false)}
        confirmLoading={confirmLoading}
        handleDelete={() => setModalInput({})}
        isDelete={true}
        handleOk={handleModalOk}
      >
        <Row gutter={16}>
          <Col span={24}>
            <h3 style={{ color: "white" }}>
              Group{" "}
              {groupDropdownValue !== ""
                ? `${groupDropdownValue.split(" ")[0]} ${
                    groupDropdownValue.split(" ")[2]
                  }`
                : ""}
            </h3>
          </Col>
          <Col
            span={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NumberField
              placeholder="Delay Min"
              name="delayMin"
              onChange={(value) => handleModalInputChange("delayMin", value)}
              tooltip="SEC"
              value={modalInput.delayMin}
              min={-100}
            />
          </Col>
          <Col
            span={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NumberField
              placeholder="Delay Max"
              name="delayMax"
              onChange={(value) => handleModalInputChange("delayMax", value)}
              tooltip="SEC"
              value={modalInput.delayMax}
              min={-100}
            />
          </Col>
        </Row>
      </CustomModal>
    </div>
  );
};
