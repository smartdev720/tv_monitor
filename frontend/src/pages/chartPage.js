import React, { useState, useEffect } from "react";
import { Button, Col, message, Row } from "antd";
import { UserDropdownGroup } from "../components/common/user/userDropdownGroup";
import { Spinner, Chart } from "../components/common";
import { useGlobal } from "../lib/globalFunc";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getDateWithISO, getPrevday, getNextday } from "../constant/func";
import moment from "moment";

export const ChartPage = () => {
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [currentDevice, setCurrentDevice] = useState({});
  const [tvTypeDropdownValue, setTvTypeDropdownValue] = useState("");
  const [settingIdDropdownValue, setSettingIdDropdownValue] = useState("");
  const [settingIdDropdown, setSettingIdDropdown] = useState([]);
  const [date, setDate] = useState(null);
  const [chartData, setChartData] = useState([]);

  const { devices } = useSelector((state) => state.devices);
  const { selectedGlobalData } = useSelector(
    (state) => state.selectedGlobalData
  );
  const { user } = useSelector((state) => state.user);

  const {
    getDevicesById,
    getSettingsAndFillSettingId,
    getChartDataByIdAndDate,
    loading,
    setLoading,
  } = useGlobal();
  const { t } = useTranslation();

  const getChartDataAndPutChartData = async (tvType, settingId, date) => {
    try {
      const data = await getChartDataByIdAndDate(tvType, {
        id: settingId,
        date,
      });
      if (data) {
        const chartDataSource = data.map((dt) => {
          if (tvType !== "analog_settings") {
            return {
              pwr: dt.pwr,
              snr: dt.snr,
              ber: dt.ber,
              time: dt.time_dat,
            };
          } else {
            return {
              pwr: dt.pwr,
              snr: dt.snr,
              time: dt.time_dat,
            };
          }
        });
        setChartData(chartDataSource);
      }
    } catch (err) {
      message.error(t("badRequest"));
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
        const options = data
          .filter((dt) => dt.active === 1)
          .map((dt) => ({
            value: dt.id,
            label:
              tvTypeDropdownValue === "analog_settings"
                ? dt.program_name
                : dt.name,
          }));
        setSettingIdDropdown(options);
        setSettingIdDropdownValue("");
        setChartData([]);
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
            label: value === "analog_settings" ? dt.program_name : dt.name,
          }));
        setSettingIdDropdown(options);
        setSettingIdDropdownValue("");
        setChartData([]);
      }
    }
  };

  const handleSettingIdDropdownChange = async (value) => {
    setSettingIdDropdownValue(value);
    if (date) {
      const formattedDate = getDateWithISO(date);
      await getChartDataAndPutChartData(
        tvTypeDropdownValue,
        value,
        formattedDate
      );
    } else {
      message.info(t("validDate"));
    }
  };

  const handleDatePickerChange = async (date) => {
    setDate(date);
    if (date && settingIdDropdownValue !== "") {
      const formattedDate = getDateWithISO(date);
      await getChartDataAndPutChartData(
        tvTypeDropdownValue,
        settingIdDropdownValue,
        formattedDate
      );
    }
  };

  const handlePrev = async () => {
    if (date && settingIdDropdownValue !== "") {
      const formattedDate = getPrevday(date);
      await getChartDataAndPutChartData(
        tvTypeDropdownValue,
        settingIdDropdownValue,
        formattedDate
      );
      const prevDateMoment = moment(formattedDate);
      setDate(prevDateMoment);
    }
  };

  const handleNext = async () => {
    if (date && settingIdDropdownValue !== "") {
      const formattedDate = getNextday(date);
      await getChartDataAndPutChartData(
        tvTypeDropdownValue,
        settingIdDropdownValue,
        formattedDate
      );
      const nextDateMoment = moment(formattedDate);
      setDate(nextDateMoment);
    }
  };
  /////////////////////////////////////////////////

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
          const options = data
            .filter((dt) => dt.active === 1)
            .map((dt) => ({
              value: dt.id,
              label: tvType === "analog_settings" ? dt.program_name : dt.name,
            }));
          setSettingIdDropdown(options);
          setSettingIdDropdownValue("");
          setChartData([]);
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
          iptvMissed={true}
        />
      </Row>
      <Row gutter={16} style={{ marginTop: 30 }}>
        <Col span={24}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              style={{ marginRight: 100 }}
              type="link"
              onClick={handlePrev}
              disabled={!date || settingIdDropdownValue === ""}
            >
              {t("prev")}
            </Button>
            <Button
              type="primary"
              onClick={handleNext}
              disabled={!date || settingIdDropdownValue === ""}
            >
              {t("next")}
            </Button>
          </div>
          <div style={{ marginTop: 30 }}>
            <Chart data={chartData} />
          </div>
        </Col>
      </Row>
    </div>
  );
};
