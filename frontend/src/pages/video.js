import React, { useState, useEffect } from "react";
import { Col, Row, Table, Radio, message } from "antd";
import { useSelector } from "react-redux";
import { UserDropdownGroup } from "../components/common/user/userDropdownGroup";
import { Spinner, VideoPlayer } from "../components/common";
import { useGlobal } from "../lib/globalFunc";
import { getDateWithISO } from "../constant/func";
import { useTranslation } from "react-i18next";

export const Video = () => {
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [tvTypeDropdownValue, setTvTypeDropdownValue] = useState("");
  const [settingIdDropdownValue, setSettingIdDropdownValue] = useState("");
  const [currentDevice, setCurrentDevice] = useState({});
  const [settingIdDropdown, setSettingIdDropdown] = useState([]);
  const [date, setDate] = useState(null);
  const [settingDataSource, setSettingDataSource] = useState([]);
  const [selectedSettingRow, setSelectedSettingRow] = useState({});
  const [selectedSettingKey, setSelectedSettingKey] = useState("");
  const [selectedVideoListRow, setSelectedVideoListRow] = useState({});
  const [selectedVideoListKey, setSelectedVideoListKey] = useState("");
  const [videoListDataSource, setVideoListDataSource] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [isVideoError, setIsVideoError] = useState(false);

  const { devices } = useSelector((state) => state.devices);
  const { user } = useSelector((state) => state.user);
  const { selectedGlobalData } = useSelector(
    (state) => state.selectedGlobalData
  );
  const {
    getDevicesById,
    getSettingsAndFillSettingId,
    getVideoListByIdAndDate,
    getPmtsBySettingId,
    loading,
    setLoading,
  } = useGlobal();
  const { t } = useTranslation();

  // Table columns
  const settingColumns = [
    {
      title: ``,
      render: (_, record) => (
        <Radio
          checked={selectedSettingKey === record.key}
          onChange={() => handleSettingRowSelect(record.key, record)}
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
      title: `${t("name")}`,
      dataIndex: "name",
    },
  ];

  const videoListColumns = [
    {
      title: ``,
      render: (_, record) => (
        <Radio
          checked={selectedVideoListKey === record.key}
          onChange={() => handleVideoListRowSelect(record.key, record)}
        />
      ),
    },
    {
      title: `${t("name")}`,
      dataIndex: "name",
    },
    {
      title: `${t("date")}`,
      dataIndex: "date",
    },
    {
      title: `${t("size")}`,
      dataIndex: "size",
    },
  ];

  const getVideoList = async (tvType, settingId, date) => {
    try {
      const data = await getVideoListByIdAndDate(tvType, {
        id: settingId,
        date,
      });
      if (data) {
        const dataSource = data.map((dt) => {
          const dateObj = new Date(dt.time_dat);
          const localDate = new Date(
            dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
          );
          const formattedDate = localDate
            .toISOString()
            .replace("T", " ")
            .split(".")[0];
          return {
            key: dt.cnt,
            name: dt.cnt,
            date: formattedDate,
            size: `${Number(dt.stl) * 1024} KB`,
          };
        });
        setVideoListDataSource(dataSource);
        setSelectedVideoListKey("");
        setSelectedVideoListRow({});
        setVideoSrc("");
      }
    } catch (err) {
      message.error(t("badRequest"));
    }
  };

  const getVideoDirectoy = () => {
    switch (tvTypeDropdownValue) {
      case "analog_settings":
        return "9";
      case "iptv_settings":
        return "7";
      case "cable_settings":
        return "3";
      case "t2_settings":
        return "6";
      default:
        return;
    }
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
        if (
          tvTypeDropdownValue === "analog_settings" ||
          tvTypeDropdownValue === "iptv_settings"
        ) {
          const dataSource = data
            .filter((dt) => dt.active === 1)
            .map((dt) => ({
              key: dt.id,
              logo:
                tvTypeDropdownValue === "analog_settings"
                  ? dt.program_name
                  : dt.name,
              name:
                tvTypeDropdownValue === "analog_settings"
                  ? dt.program_name
                  : dt.name,
            }));
          setSettingIdDropdownValue("");
          setSettingIdDropdown([]);
          setSettingDataSource(dataSource);
          setVideoListDataSource([]);
          setSelectedSettingKey("");
          setSelectedSettingRow({});
          setSelectedVideoListKey("");
          setSelectedVideoListRow({});
          setVideoSrc("");
        } else {
          const options = data
            .filter((dt) => dt.active === 1)
            .map((dt) => ({
              value: dt.id,
              label: dt.name,
            }));
          setSettingIdDropdownValue("");
          setSettingIdDropdown(options);
          setSettingDataSource([]);
          setVideoListDataSource([]);
          setSelectedSettingKey("");
          setSelectedSettingRow({});
          setSelectedVideoListKey("");
          setSelectedVideoListRow({});
          setVideoSrc("");
        }
      }
    }
  };

  const handleTvDropdownChange = async (value) => {
    setTvTypeDropdownValue(value);
    if (currentDevice.id) {
      const data = await getSettingsAndFillSettingId(value, currentDevice.id);
      if (data) {
        if (value === "analog_settings" || value === "iptv_settings") {
          const dataSource = data
            .filter((dt) => dt.active === 1)
            .map((dt) => ({
              key: dt.id,
              logo: value === "analog_settings" ? dt.program_name : dt.name,
              name: value === "analog_settings" ? dt.program_name : dt.name,
            }));

          setSettingIdDropdownValue("");
          setSettingIdDropdown([]);
          setSettingDataSource(dataSource);
          setVideoListDataSource([]);
          setSelectedSettingKey("");
          setSelectedSettingRow({});
          setSelectedVideoListKey("");
          setSelectedVideoListRow({});
          setVideoSrc("");
        } else {
          const options = data
            .filter((dt) => dt.active === 1)
            .map((dt) => ({
              value: dt.id,
              label: dt.name,
            }));
          setSettingIdDropdownValue("");
          setSettingIdDropdown(options);
          setSettingDataSource([]);
          setVideoListDataSource([]);
          setSelectedSettingKey("");
          setSelectedSettingRow({});
          setSelectedVideoListKey("");
          setSelectedVideoListRow({});
          setVideoSrc("");
        }
      }
    }
  };

  const handleSettingIdDropdownChange = async (value) => {
    setSettingIdDropdownValue(value);
    const data = await getPmtsBySettingId(tvTypeDropdownValue, value);
    if (data) {
      const dataSource = data
        .filter((dt) => dt.under_control === 1)
        .map((dt) => ({
          key: dt.id,
          logo: dt.service_name,
          name: dt.service_name,
        }));
      setSettingDataSource(dataSource);
      setSelectedSettingKey("");
      setSelectedSettingRow({});
      setSelectedVideoListKey("");
      setSelectedVideoListRow({});
      setVideoSrc("");
    }
  };

  const handleDatePickerChange = async (date) => {
    setDate(date);
    if (currentDevice.id && tvTypeDropdownValue !== "" && date) {
      const formattedDate = getDateWithISO(date);
      if (selectedSettingRow.key) {
        await getVideoList(
          tvTypeDropdownValue,
          selectedSettingRow.key,
          formattedDate
        );
      }
    }
  };

  const handleSettingRowSelect = async (key, record) => {
    setSelectedSettingKey(key === selectedSettingKey ? null : key);
    setSelectedSettingRow(record);
    if (date && currentDevice.id && tvTypeDropdownValue !== "") {
      const formattedDate = getDateWithISO(date);
      await getVideoList(tvTypeDropdownValue, key, formattedDate);
    }
  };

  const handleVideoListRowSelect = (key, record) => {
    setSelectedVideoListKey(key === selectedVideoListKey ? null : key);
    setSelectedVideoListRow(record);
    if (key === selectedVideoListKey) {
      setVideoSrc("");
    } else {
      const directory = getVideoDirectoy();
      const uniqueVideoSrc = `http://localhost:5000/video/${directory}/${key}?t=${new Date().getTime()}`;
      setVideoSrc(uniqueVideoSrc);
    }
  };
  ///////////////////////////////////////////////

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
    const fetchSetting = async () => {
      const { location, tvType, date } = selectedGlobalData;
      if (location && tvType) {
        const selectedId = location.split(" ")[0];
        const data = await getSettingsAndFillSettingId(
          tvType,
          Number(selectedId)
        );
        if (data) {
          if (tvType === "analog_settings" || tvType === "iptv_settings") {
            const dataSource = data
              .filter((dt) => dt.active === 1)
              .map((dt) => ({
                key: dt.id,
                logo: tvType === "analog_settings" ? dt.program_name : dt.name,
                name: tvType === "analog_settings" ? dt.program_name : dt.name,
              }));
            setSettingIdDropdownValue("");
            setSettingIdDropdown([]);
            setSettingDataSource(dataSource);
            setVideoListDataSource([]);
            setSelectedSettingKey("");
            setSelectedSettingRow({});
            setSelectedVideoListKey("");
            setSelectedVideoListRow({});
            setVideoSrc("");
          } else {
            const options = data
              .filter((dt) => dt.active === 1)
              .map((dt) => ({
                value: dt.id,
                label: dt.name,
              }));
            setSettingIdDropdownValue("");
            setSettingIdDropdown(options);
            setSettingDataSource([]);
            setVideoListDataSource([]);
            setSelectedSettingKey("");
            setSelectedSettingRow({});
            setSelectedVideoListKey("");
            setSelectedVideoListRow({});
            setVideoSrc("");
          }
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
        />
      </Row>
      <Row gutter={16} style={{ margin: 20 }}>
        <Col span={7}>
          <Table
            columns={videoListColumns}
            dataSource={videoListDataSource}
            scroll={{ y: 500 }}
            pagination={false}
          />
        </Col>
        <Col span={5}>
          <Table
            columns={settingColumns}
            dataSource={settingDataSource}
            scroll={{ y: 500 }}
            pagination={false}
          />
        </Col>
        <Col span={12}>
          <VideoPlayer
            videoSrc={videoSrc}
            setIsVideoError={setIsVideoError}
            setLoading={setLoading}
          />
          {videoSrc !== "" && isVideoError && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <span
                style={{
                  padding: "2px 8px",
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: 8,
                }}
              >
                {selectedSettingRow.name}
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: 8,
                }}
              >
                {selectedVideoListRow.date}
              </span>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};
