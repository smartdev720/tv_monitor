import React, { useState, useCallback, useEffect } from "react";
import {
  Col,
  Row,
  Table,
  DatePicker,
  Button,
  message,
  Input,
  Checkbox,
} from "antd";
import { Spinner } from "../components/common";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import {
  fetchAllGroups,
  fetchAllSchedules,
  insertSchedule,
  updateSchedule,
} from "../lib/api";
import Papa from "papaparse";
import { useTranslation } from "react-i18next";

export const Schedules = () => {
  const [loading, setLoading] = useState(false);
  const [scheduleDataSource, setScheduleDataSource] = useState([]);
  const [groupDataSource, setGroupDataSource] = useState([]);
  const [typeDropdownValue, setTypeDropdownValue] = useState("0");
  const [editDataSource, setEditDataSource] = useState([]);
  const [data, setData] = useState({});
  const [formattedData, setFormattedData] = useState({});
  const [editId, setEditId] = useState("");

  const { t } = useTranslation();

  // Call APIs To Backend
  const getAllGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllGroups();
      if (response.ok) {
        const { data } = response;
        const dataSource = data.map((dt, index) => ({
          key: dt.id,
          no: dt.id,
          channel: dt.channel,
          name: dt.name,
        }));
        setGroupDataSource(dataSource);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllSchedules();
      if (response.ok) {
        const { data } = response;
        const dataSource = data.map((dt) => {
          const csvData = dt.text;
          const parsedCsvData = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
          }).data;
          const formattedData = fillEditDataSourceFromCSV(parsedCsvData);
          return {
            key: dt.id,
            type: dt.type === 0 ? t("date") : t("everyday"),
            date: dt.date ? new Date(dt.date).toISOString().split("T")[0] : "",
            text: formattedData,
          };
        });

        setScheduleDataSource(dataSource);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSchedule = async (schedule) => {
    try {
      setLoading(true);
      const response = await insertSchedule(schedule);

      if (response.ok) {
        setData({});
        fillEditDataSource();
        setTypeDropdownValue("0");
        const formattedText = fillEditDataSourceFromCSV(
          transformToOriginalFormat(schedule.text)
        );
        const newScheduleEntry = {
          key: scheduleDataSource.length + 1,
          type: schedule.type === "0" ? t("date") : t("everyday"),
          date: schedule.date ? schedule.date : "",
          text: formattedText,
        };
        setScheduleDataSource((prevData) => [...prevData, newScheduleEntry]);
        message.success(t("savedSuccessfully"));
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const editSchedule = async (schedule) => {
    try {
      setLoading(true);
      const response = await updateSchedule(schedule);
      if (response.ok) {
        setData({});
        fillEditDataSource();
        setTypeDropdownValue("0");
        const formattedText = fillEditDataSourceFromCSV(
          transformToOriginalFormat(schedule.text)
        );
        const updatedScheduleEntry = {
          key: editId,
          type: schedule.type === "0" ? t("date") : t("everyday"),
          date: schedule.date ? schedule.date : "",
          text: formattedText,
        };
        setScheduleDataSource((prevData) =>
          prevData.map((item) =>
            item.key === editId ? updatedScheduleEntry : item
          )
        );
        setEditId("");
        message.success(response.message);
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Initialize
  const fillEditDataSource = useCallback(() => {
    let dataSource = [];
    for (let i = 0; i < 24; i++) {
      let rowKey = i.toString().padStart(2, "0");
      dataSource.push({
        key: rowKey,
        empty: rowKey,
        zero: "",
        first: "",
        second: "",
        third: "",
        fourth: "",
        fifth: "",
      });
    }
    setEditDataSource(dataSource);
  }, []);

  // Columns
  const scheduleColumns = [
    { title: t("type"), dataIndex: "type" },
    { title: t("date"), dataIndex: "date" },
  ];

  const groupColumns = [
    { title: "No", dataIndex: "no" },
    { title: t("channel"), dataIndex: "channel" },
    { title: t("name"), dataIndex: "name" },
  ];

  const editColumns = [
    {
      title: "",
      dataIndex: "empty",
      render: (text) => <span>{text}</span>,
    },
    {
      title: ":00",
      dataIndex: "zero",
      render: (text, record) => (
        <Input
          type="text"
          value={text}
          style={{ border: "none", outline: "none" }}
          onChange={(e) => handleInputChange(e, record.key, "zero")}
        />
      ),
    },
    {
      title: ":10",
      dataIndex: "first",
      render: (text, record) => (
        <Input
          type="text"
          value={text}
          style={{ border: "none", outline: "none" }}
          onChange={(e) => handleInputChange(e, record.key, "first")}
        />
      ),
    },
    {
      title: ":20",
      dataIndex: "second",
      render: (text, record) => (
        <Input
          type="text"
          value={text}
          style={{ border: "none", outline: "none" }}
          onChange={(e) => handleInputChange(e, record.key, "second")}
        />
      ),
    },
    {
      title: ":30",
      dataIndex: "third",
      render: (text, record) => (
        <Input
          type="text"
          value={text}
          style={{ border: "none", outline: "none" }}
          onChange={(e) => handleInputChange(e, record.key, "third")}
        />
      ),
    },
    {
      title: ":40",
      dataIndex: "fourth",
      render: (text, record) => (
        <Input
          type="text"
          value={text}
          style={{ border: "none", outline: "none" }}
          onChange={(e) => handleInputChange(e, record.key, "fourth")}
        />
      ),
    },
    {
      title: ":50",
      dataIndex: "fifth",
      render: (text, record) => (
        <Input
          type="text"
          value={text}
          style={{ border: "none", outline: "none" }}
          onChange={(e) => handleInputChange(e, record.key, "fifth")}
        />
      ),
    },
  ];

  const handleInputChange = (e, hourKey, minute) => {
    const inputValue = e.target.value;
    if (Number(inputValue) || inputValue === "") {
      const newDataSource = editDataSource.map((item) => {
        if (item.key === hourKey) {
          return { ...item, [minute]: inputValue };
        }
        return item;
      });

      setEditDataSource(newDataSource);
    }
  };

  const fillEditDataSourceFromCSV = (text) => {
    let newDataSource = [];

    for (let i = 0; i < 24; i++) {
      let hourEntry = {
        key: i.toString().padStart(2, "0"),
        empty: i.toString().padStart(2, "0"),
        zero: "",
        first: "",
        second: "",
        third: "",
        fourth: "",
        fifth: "",
      };

      text.forEach((item) => {
        if (item.hour === i) {
          const timeSlotIndex = item.minute / 10;
          const timeSlots = [
            "zero",
            "first",
            "second",
            "third",
            "fourth",
            "fifth",
          ];

          hourEntry[timeSlots[timeSlotIndex]] = item.groupId.toString();
        }
      });

      newDataSource.push(hourEntry);
    }

    return newDataSource;
  };

  const transformToOriginalFormat = (scheduleData) => {
    const result = [];
    scheduleData.forEach((entry) => {
      entry.minuteAndGroupId.forEach((minuteData) => {
        result.push({
          groupId: minuteData.groupId,
          hour: entry.hour,
          minute: minuteData.minute,
        });
      });
    });

    return result;
  };

  const handleDatePickerChange = (date) => {
    if (!date) {
      setData((prevData) => ({ ...prevData, date: null }));
      return;
    }
    const localDate = new Date(date.$d);
    localDate.setMinutes(
      localDate.getMinutes() - localDate.getTimezoneOffset()
    );
    const selectedDate = localDate.toISOString().split("T")[0];
    const filtered = scheduleDataSource.filter(
      (sds) => sds.date === selectedDate
    );
    if (filtered.length > 0) {
      const text = filtered[0].text;
      setEditDataSource(text);
      setEditId(filtered[0].key);
      message.info(t("scheduleAlreadyEdited"));
    } else {
      fillEditDataSource();
      setEditId("");
    }
    setData((prevData) => ({ ...prevData, date }));
  };

  const handleTypeDropdownChange = (e) => {
    setTypeDropdownValue(e.target.checked ? "1" : "0");
    setData({ ...data, date: null });
  };

  const getValuesForRowAndColumns = (hourKey, columns) => {
    const row = editDataSource.find((item) => item.key === hourKey);
    if (!row) {
      return null;
    }
    const columnValues = columns.map((col) => row[col]);
    return {
      row: row.key,
      columns: columnValues,
    };
  };

  const validate = () => {
    for (const sd of editDataSource) {
      const result = getValuesForRowAndColumns(sd.key, [
        "zero",
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
      ]);
      const { columns } = result;
      const removedEmpty = columns.filter((col) => col !== "");
      if (removedEmpty.length > 0) {
        for (const rcol of removedEmpty) {
          const filtered = groupDataSource.filter(
            (gds) => gds.key === Number(rcol)
          );
          if (filtered.length === 0) {
            message.error(t("inputCorrectGroupNumber"));
            return false;
          }
        }
      }
    }
    const { date } = data;
    if (typeDropdownValue === "") {
      message.error(t("selectType"));
      return false;
    }
    if (typeDropdownValue === "0") {
      const selectedDate = new Date(date.$d).getTime();
      const today = new Date().setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        message.error(t("selectedDateValidation"));
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (validate()) {
      let text = [];
      for (const sd of editDataSource) {
        debugger;
        const result = getValuesForRowAndColumns(sd.key, [
          "zero",
          "first",
          "second",
          "third",
          "fourth",
          "fifth",
        ]);
        const { columns } = result;
        const removedEmpty = columns
          .map((col, index) => {
            if (col !== "") {
              return { groupId: Number(col), minute: index * 10 };
            }
            return null;
          })
          .filter(Boolean);

        if (removedEmpty.length > 0) {
          text.push({
            hour: Number(result.row),
            minuteAndGroupId: removedEmpty,
          });
        }
      }

      const { date } = data;
      let fData = {};
      if (date) {
        const localDate = new Date(date.$d);
        localDate.setMinutes(
          localDate.getMinutes() - localDate.getTimezoneOffset()
        );
        const selectedDate = localDate.toISOString().split("T")[0];
        fData = {
          type: typeDropdownValue,
          date: selectedDate,
          text,
        };
      } else {
        fData = {
          type: typeDropdownValue,
          date: null,
          text,
        };
      }
      setFormattedData(fData);
      await saveSchedule(fData);
    }
  };

  const handleEdit = async () => {
    if (validate()) {
      let text = [];
      for (const sd of editDataSource) {
        const result = getValuesForRowAndColumns(sd.key, [
          "zero",
          "first",
          "second",
          "third",
          "fourth",
          "fifth",
        ]);
        const { columns } = result;
        const removedEmpty = columns
          .map((col, index) => {
            if (col !== "") {
              return { groupId: Number(col), minute: index * 10 };
            }
            return null;
          })
          .filter(Boolean);

        if (removedEmpty.length > 0) {
          text.push({
            hour: Number(result.row),
            minuteAndGroupId: removedEmpty,
          });
        }
      }

      const { date } = data;
      let fData = {};
      if (date) {
        const localDate = new Date(date.$d);
        localDate.setMinutes(
          localDate.getMinutes() - localDate.getTimezoneOffset()
        );
        const selectedDate = localDate.toISOString().split("T")[0];
        fData = {
          id: editId,
          type: typeDropdownValue,
          date: selectedDate,
          text,
        };
      } else {
        fData = {
          id: editId,
          type: typeDropdownValue,
          date: null,
          text,
        };
      }
      setFormattedData(fData);
      await editSchedule(fData);
    }
  };

  useEffect(() => {
    getAllGroups();
  }, [getAllGroups]);

  useEffect(() => {
    fillEditDataSource();
  }, [fillEditDataSource]);

  useEffect(() => {
    getAllSchedules();
  }, [getAllSchedules]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={5}>
          <h1>{t("listOfSchedules")}</h1>
          <Table
            columns={scheduleColumns}
            dataSource={scheduleDataSource}
            pagination={false}
            scroll={{
              x: 0,
              y: 500,
            }}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={7}>
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 5 }}>
              <label style={{ fontSize: "1em", color: "gray" }}>
                {t("selectDate")}
              </label>
            </div>
            <DatePicker
              style={{ display: "block" }}
              disabled={typeDropdownValue !== "0"}
              onChange={handleDatePickerChange}
              value={data.date}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: "1em", color: "gray", marginRight: 20 }}>
              {t("useDaily")}
            </label>
            <Checkbox
              checked={typeDropdownValue === "1"}
              value={typeDropdownValue}
              onChange={handleTypeDropdownChange}
            />
          </div>
          <h1>{t("listOfGroups")}</h1>
          <Table
            columns={groupColumns}
            dataSource={groupDataSource}
            pagination={false}
            scroll={{
              x: 0,
              y: 500,
            }}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={8}>
          <h1>{t("editSchedules")}</h1>
          <Table
            columns={editColumns}
            dataSource={editDataSource}
            pagination={false}
            bordered
            scroll={{
              x: 0,
              y: 500,
            }}
          />
        </Col>
      </Row>
      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <div
          style={{
            textAlign: "right",
            marginTop: 20,
          }}
        >
          {editId === "" ? (
            <Button color="primary" variant="solid" onClick={handleSave}>
              {t("save")} <SendOutlined style={{ marginLeft: 8 }} />
            </Button>
          ) : (
            <Button color="primary" variant="solid" onClick={handleEdit}>
              {t("edit")} <SaveOutlined style={{ marginLeft: 8 }} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
