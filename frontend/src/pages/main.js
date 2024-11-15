import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Checkbox, Col, message, Row, Tooltip } from "antd";
import {
  CustomModal,
  Mozaic,
  NumberField,
  Spinner,
} from "../components/common";
import { UserDropdownGroup } from "../components/common/user/userDropdownGroup";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../lib/globalFunc";
import { fetchGroupByBadDataCnt, updateExtVal } from "../lib/api";
import { getDateWithISO } from "../constant/func";
import {
  setSelectedGlobalLocation,
  setSelectedGlobalTvType,
  setSelectedGlobalDate,
  setSelectedGlobalSetting,
} from "../store/slices/selectedGlobalDataSlice";

export const Main = () => {
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [tvTypeDropdownValue, setTvTypeDropdownValue] = useState("");
  const [settingIdDropdownValue, setSettingIdDropdownValue] = useState("");
  const [currentDevice, setCurrentDevice] = useState({});
  const [settingIdDropdown, setSettingIdDropdown] = useState([]);
  const [date, setDate] = useState(null);
  const [modal, setModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [notifyInput, setNotifyInput] = useState({});
  const [mozaicData, setMozaicData] = useState([]);
  const [badDataGroup, setBadDataGroup] = useState({});
  const [compared, setCompared] = useState(false);

  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);
  const { user } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const {
    getDevicesById,
    getSettingsAndFillSettingId,
    getAllSettings,
    getGroupByBadDataCnt,
    loading,
  } = useGlobal();

  // Interact with backend
  const updateEXT = async (data) => {
    try {
      setConfirmLoading(false);
      const response = await updateExtVal(data);
      if (response.ok) {
        message.success(response.message);
        setNotifyInput({});
      }
    } catch (err) {
      message.error(t("badRequest"));
    } finally {
      setConfirmLoading(false);
    }
  };
  ////////////////////////////////////////////////////////////

  // Handle changes
  const handleDeviceChange = async (value) => {
    const selectedId = value.split(" ")[0];
    const selectedDevice = devices.find(
      (device) => device.id === Number(selectedId)
    );
    setCurrentDevice(selectedDevice);
    dispatch(setSelectedGlobalLocation(value));
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
        setSettingIdDropdownValue("");
        setSettingIdDropdown(options);
      }
    }
  };

  const handleTvDropdownChange = async (value) => {
    setTvTypeDropdownValue(value);
    dispatch(setSelectedGlobalTvType(value));
    if (currentDevice.id) {
      const data = await getSettingsAndFillSettingId(value, currentDevice.id);
      if (data) {
        const options = data
          .filter((dt) => dt.active === 1)
          .map((dt) => ({
            value: dt.id,
            label: value === "analog_settings" ? dt.program_name : dt.name,
          }));
        setSettingIdDropdownValue("");
        setSettingIdDropdown(options);
      }
    }
  };

  const handleSettingIdDropdownChange = async (value) => {
    setSettingIdDropdownValue(value);
    setSelectedGlobalSetting(value);
  };

  const handleDatePickerChange = async (date) => {
    setDate(date);
    setSelectedGlobalDate(date);
    if (date && user.id) {
      const formattedDate = getDateWithISO(date);
      const data = await getAllSettings({
        locations: user.locations,
        date: formattedDate,
      });
      setMozaicData(data);
    }
  };

  const handleNotifyInputChange = (name, value) => {
    if (value > 100) {
      message.info("The maximum value is 100");
      return;
    }
    setNotifyInput({ ...notifyInput, [name]: value });
  };

  const handleNotifyCheckboxChange = (e) =>
    setNotifyInput({ ...notifyInput, notify: e.target.checked });

  const handleNotifySave = async () => {
    const { notify } = notifyInput;
    let data;
    if (settingIdDropdownValue !== "") {
      data = {
        ...notifyInput,
        active: notify ? 1 : 0,
        settingsId: settingIdDropdownValue,
        commandId:
          tvTypeDropdownValue === "analog_settings"
            ? 8
            : tvTypeDropdownValue === "cable_settings"
            ? 1
            : 4,
        userId: user.id,
      };
    } else {
      data = {
        ...notifyInput,
        active: notify ? 1 : 0,
        commandId:
          tvTypeDropdownValue === "analog_settings"
            ? 8
            : tvTypeDropdownValue === "cable_settings"
            ? 1
            : 4,
        userId: user.id,
      };
    }
    await updateEXT(data);
  };
  ////////////////////////////////////////////////////////////

  // Hooks
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
    const fetchAllSettings = async () => {
      if (user.id) {
        await getDevicesById(user.locations);
        const data = await getAllSettings({
          locations: user.locations,
          date: new Date().toISOString().split("T")[0],
        });
        setMozaicData(data.setting);
        if (data.compareCnts.length > 0) {
          setCompared(true);
          const group = await getGroupByBadDataCnt(
            data.compareCnts[data.compareCnts.length - 1].cnt
          );
          if (group.id) {
            setBadDataGroup(group);
          }
        } else {
          setCompared(false);
        }
      }
    };
    fetchAllSettings();
  }, [user]);

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
      <Row gutter={16}>
        <Col span={5}></Col>
        <Col span={1} style={{ marginLeft: 20 }}>
          <Tooltip placement="rightTop" title="Configuring notifications">
            <Button
              type="link"
              disabled={!currentDevice.id || tvTypeDropdownValue === ""}
              onClick={() => setModal(true)}
            >
              <img src="./notify.svg" alt="notify" />
            </Button>
          </Tooltip>
        </Col>
      </Row>
      {compared && (
        <Row
          gutter={16}
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col span={6}>
            <Card
              title="Compare"
              style={{
                background: `${
                  badDataGroup.id ? "#c54d4d" : "rgb(58, 151, 87)"
                }`,
              }}
            >
              {badDataGroup.id && (
                <p
                  style={{ textAlign: "center", color: "white" }}
                >{`${badDataGroup.id} ${badDataGroup.name}`}</p>
              )}
            </Card>
          </Col>
        </Row>
      )}
      <Row gutter={16}>
        {mozaicData.length > 0 &&
          mozaicData.map((mozaic) => <Mozaic item={mozaic} />)}
      </Row>
      <CustomModal
        open={modal}
        title={t("configNotify")}
        confirmLoading={confirmLoading}
        isSave={true}
        isDelete={true}
        handleOk={handleNotifySave}
        handleCancel={() => setModal(false)}
        handleDelete={() => setNotifyInput({})}
      >
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={12}>
            <NumberField
              name="pwrMin"
              value={notifyInput.pwrMin ? notifyInput.pwrMin : 0}
              onChange={(value) => handleNotifyInputChange("pwrMin", value)}
              placeholder="Pwr min"
            />
          </Col>
          <Col span={12}>
            <NumberField
              name="pwrMax"
              value={notifyInput.pwrMax ? notifyInput.pwrMax : 0}
              onChange={(value) => handleNotifyInputChange("pwrMax", value)}
              placeholder="Pwr max"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={12}>
            <NumberField
              name="snrMin"
              value={notifyInput.snrMin ? notifyInput.snrMin : 0}
              onChange={(value) => handleNotifyInputChange("snrMin", value)}
              placeholder="Snr min"
            />
          </Col>
          <Col span={12}>
            <NumberField
              name="snrMax"
              value={notifyInput.snrMax ? notifyInput.snrMax : 0}
              onChange={(value) => handleNotifyInputChange("snrMax", value)}
              placeholder="Snr max"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={12}>
            <NumberField
              name="berMin"
              value={notifyInput.berMin ? notifyInput.berMin : 0}
              onChange={(value) => handleNotifyInputChange("berMin", value)}
              placeholder="Ber min"
            />
          </Col>
          <Col span={12}>
            <NumberField
              name="berNax"
              value={notifyInput.berNax ? notifyInput.berNax : 0}
              onChange={(value) => handleNotifyInputChange("berNax", value)}
              placeholder="Ber max"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={2} style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              name="notify"
              value={notifyInput.notify}
              onChange={handleNotifyCheckboxChange}
            />
            <label style={{ color: "white", marginLeft: 10 }}>Notify</label>
          </Col>
        </Row>
      </CustomModal>
    </div>
  );
};
