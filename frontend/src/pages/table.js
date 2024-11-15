import React, { useState, useEffect } from "react";
import { Table, Row } from "antd";
import { UserDropdownGroup } from "../components/common/user/userDropdownGroup";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Spinner } from "../components/common";
import { getDateWithISO } from "../constant/func";
import { useGlobal } from "../lib/globalFunc";

export const TablePage = () => {
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [tvTypeDropdownValue, setTvTypeDropdownValue] = useState("");
  const [settingIdDropdownValue, setSettingIdDropdownValue] = useState("");
  const [currentDevice, setCurrentDevice] = useState({});
  const [settingIdDropdown, setSettingIdDropdown] = useState([]);
  const [date, setDate] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTableData, setCurrentTableData] = useState([]);

  const { devices } = useSelector((state) => state.devices);
  const { user } = useSelector((state) => state.user);
  const { selectedGlobalData } = useSelector(
    (state) => state.selectedGlobalData
  );
  const { t } = useTranslation();
  const {
    getDevicesById,
    getPmtsBySettingIdBeforeDate,
    getSettingsAndFillSettingId,
    loading,
  } = useGlobal();

  // Table Columns
  const columns = [
    {
      title: `${t("name")}`,
      dataIndex: "service_name",
    },
    {
      title: `${t("time")}`,
      dataIndex: "time",
    },
  ];

  const fillTableData = (responseData) => {
    const data = responseData.filter((dt) => dt.under_control === 1);
    const groupedByDate = data.reduce((acc, item) => {
      const date = new Date(item.time).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push({
        key: item.id,
        service_name: item.service_name,
        time: new Date(item.time).toLocaleTimeString("en-GB"),
      });
      return acc;
    }, {});

    const groupedDataArray = Object.keys(groupedByDate).map((date) => ({
      date,
      records: groupedByDate[date],
    }));
    setGroupedData(groupedDataArray);
    setCurrentPage(1);
  };

  const tableFormat = () => {
    setCurrentPage(1);
    setGroupedData([]);
    setCurrentTableData([]);
  };

  // Handle change event
  const handleDeviceChange = async (value) => {
    const selectedId = value.split(" ")[0];
    const selectedDevice = devices.find(
      (device) => device.id === Number(selectedId)
    );
    setCurrentDevice(selectedDevice);
    if (tvTypeDropdownValue !== "") {
      const data = await getSettingsAndFillSettingId(
        tvTypeDropdownValue,
        selectedDevice.id
      );
      if (data) {
        const options = data
          .filter((dt) => dt.active === 1)
          .map((dt) => ({
            value: dt.id,
            label: dt.name,
          }));
        setSettingIdDropdownValue("");
        setSettingIdDropdown(options);
        tableFormat();
      }
    }
  };

  const handleTvDropdownChange = async (value) => {
    setTvTypeDropdownValue(value);
    if (currentDevice.id) {
      const data = await getSettingsAndFillSettingId(value, currentDevice.id);
      if (data) {
        const options = data
          .filter((dt) => dt.active === 1)
          .map((dt) => ({
            value: dt.id,
            label: dt.name,
          }));
        setSettingIdDropdownValue("");
        setSettingIdDropdown(options);
        tableFormat();
      }
    }
  };

  const handleSettingIdDropdownChange = async (value) => {
    setSettingIdDropdownValue(value);

    if (date) {
      const formattedDate = getDateWithISO(date);
      const data = await getPmtsBySettingIdBeforeDate(
        tvTypeDropdownValue,
        value,
        formattedDate
      );
      if (data) {
        fillTableData(data);
      }
    }
  };

  const handleDatePickerChange = async (date) => {
    setDate(date);
    if (
      settingIdDropdownValue !== "" &&
      currentDevice.id &&
      tvTypeDropdownValue !== "" &&
      date
    ) {
      const formattedDate = getDateWithISO(date);
      const data = await getPmtsBySettingIdBeforeDate(
        tvTypeDropdownValue,
        settingIdDropdownValue,
        formattedDate
      );
      if (data) {
        fillTableData(data);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  //////////////////////////////////////////////

  // Hooks
  useEffect(() => {
    if (devices.length > 0) {
      const deviceOpts = devices
        .filter((device) => device.active === 1)
        .map((device) => ({
          value: `${device.id} ${device.place}`,
          label: `${device.id} ${device.place}`,
        }));
      setDevicesOptions(deviceOpts);
    }
  }, [devices]);

  useEffect(() => {
    const fetchAllSettings = async () => {
      if (user.id) {
        await getDevicesById(user.locations);
      }
    };
    fetchAllSettings();
  }, [user]);

  useEffect(() => {
    if (groupedData.length > 0) {
      setCurrentTableData(groupedData[currentPage - 1].records);
    } else {
      setCurrentTableData([]);
    }
  }, [groupedData]);

  useEffect(() => {
    const fetchSetting = async () => {
      const { location, tvType, date } = selectedGlobalData;
      if (location && tvType) {
        const selectedId = selectedGlobalData.split(" ")[0];
        const data = await getSettingsAndFillSettingId(
          tvType,
          Number(selectedId)
        );
        if (data) {
          const options = data
            .filter((dt) => dt.active === 1)
            .map((dt) => ({
              value: dt.id,
              label: dt.name,
            }));
          setSettingIdDropdownValue("");
          setSettingIdDropdown(options);
          tableFormat();
        }
        setDate(date);
      }
    };
    fetchSetting();
  }, [selectedGlobalData]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <UserDropdownGroup
          devicesOptions={devicesOptions}
          currentDevice={currentDevice}
          handleDatePickerChange={handleDatePickerChange}
          handleDeviceChange={handleDeviceChange}
          date={date}
          handleTvDropdownChange={handleTvDropdownChange}
          tvTypeDropdownValue={tvTypeDropdownValue}
          settingIdDropdownValue={settingIdDropdownValue}
          handleSettingIdDropdownChange={handleSettingIdDropdownChange}
          settingIdDropdown={settingIdDropdown}
          disabled={settingIdDropdown.length === 0}
          required={true}
        />
      </Row>
      <Row gutter={16}>
        <div style={{ width: "100%", marginTop: 20 }}>
          <h3
            style={{ color: "#1668dc", marginBottom: 10, textAlign: "center" }}
          >
            {groupedData[currentPage - 1]?.date || ""}
          </h3>
          <Table
            columns={columns}
            dataSource={currentTableData}
            scroll={{ y: 500 }}
            pagination={{
              current: currentPage,
              total: groupedData.length,
              onChange: handlePageChange,
              showSizeChanger: false,
            }}
          />
        </div>
      </Row>
    </div>
  );
};
