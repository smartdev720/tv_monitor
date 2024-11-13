import React, { useCallback, useEffect, useState } from "react";
import { Col, DatePicker, message, Radio, Row, Table } from "antd";
import { CompareFrame, Dropdown, Spinner } from "../components/common";
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

  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.groups);
  const { devices } = useSelector((state) => state.devices);
  const { getAllDevices } = useGlobal();
  const { t } = useTranslation();

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

  const getDat99ByGroupIdAndDate = async (data) => {
    try {
      setLoading(true);
      const response = await fetchDat99ByGroupIdAndDate(data);
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
        const leader = cData.find((cd) => cd.deviceId === leaderId);
        const others = cData.filter(
          (item) => item !== null && item.deviceId !== leaderId
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
    if (date) {
      const formattedDate = getDateWithISO(date);
      const leaderId = value.split(" ")[1];
      setLeaderId(leaderId);
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
      await getDat99ByGroupIdAndDate({
        id: groupDropdownValue,
        date: formattedDate,
      });
    }
  };

  const handleRowSelect = async (key, record) => {
    setSelectedRowKey(key === selectedRowKey ? null : key);
    setSelectedRow(record);
    await getDat99ResByCnt(key, record);
  };
  ////////////////////////////////////////

  // Hooks
  useEffect(() => {
    getAllGroups();
    getAllDevices();
  }, [getAllGroups, getAllDevices]);

  useEffect(() => {
    if (groups.length > 0) {
      const options = groups.map((group) => ({
        value: `${group.id} ${group.model_id}`,
        label: `${group.id} ${group.name}`,
      }));
      setGroupOptions(options);
    }
  }, [groups]);
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
    </div>
  );
};
