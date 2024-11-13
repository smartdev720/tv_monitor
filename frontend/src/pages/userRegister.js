import React, { useEffect, useState } from "react";
import { Button, Col, message, Radio, Row, Table } from "antd";
import { useGlobal } from "../lib/globalFunc";
import { useSelector } from "react-redux";
import { InputField, Spinner } from "../components/common";
import PhoneInput from "antd-phone-input";
import TextArea from "antd/es/input/TextArea";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { userRegister } from "../lib/api";
import { useNavigate } from "react-router-dom";

export const UserRegister = () => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [loading, setLoading] = useState(false);
  const [selectedLocationRowKeys, setSelectedLocationRowKeys] = useState([]);
  const [locationDataSource, setLocationDataSource] = useState([]);
  const [userInput, setUserInput] = useState({});
  const [notifications, setNotifications] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("ua");

  const { getAllDevices } = useGlobal();
  const { devices } = useSelector((state) => state.devices);
  const navigate = useNavigate();

  // Location table columns
  const locationColumns = [
    {
      title: "Location ID",
      dataIndex: "locationId",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Place",
      dataIndex: "place",
    },
  ];
  ///////////////////////////////////////////

  // Handle change
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedLocationRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "",
      name: record.name,
    }),
  };

  const handleUserInputChange = (e) =>
    setUserInput({ ...userInput, [e.target.name]: e.target.value });

  const handleNotificationsChange = (e) =>
    setNotifications({ ...notifications, [e.target.name]: e.target.value });

  const handlePhoneChange = (value) => {
    const { areaCode, countryCode, phoneNumber } = value || {};
    const phoneString =
      areaCode && phoneNumber
        ? `+${countryCode} (${areaCode}) ${phoneNumber}`
        : "";
    setUserInput({ ...userInput, phone: phoneString });
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const data = {
        ...userInput,
        locationIds: selectedLocationRowKeys,
      };
      const response = await userRegister(data);
      if (response.ok) {
        message.success(response.message);
        navigate("/auth/login");
      } else {
        message.success(response.message);
        setSelectedLocationRowKeys([]);
      }
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
      setSelectedLocationRowKeys([]);
    }
  };
  ///////////////////////////////////////////

  // Validation
  const isValid = () => {
    const { name, name2, surname, email, password, telegram, viber, phone } =
      userInput;
    if (
      !name ||
      name === "" ||
      !name2 ||
      name2 === "" ||
      !surname ||
      surname === "" ||
      !email ||
      email === "" ||
      !password ||
      password === "" ||
      !telegram ||
      telegram === "" ||
      !viber ||
      viber === ""
    ) {
      return false;
    }
    const parsedPhoneNumber = parsePhoneNumberFromString(
      phone,
      selectedCountry
    );
    if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
      return false;
    }
    if (selectedLocationRowKeys.length === 0) {
      return false;
    }
    return true;
  };
  //////////////////////////////////////////////////

  // Hooks
  useEffect(() => {
    getAllDevices();
  }, [getAllDevices]);

  useEffect(() => {
    if (devices.length > 0) {
      const dataSource = devices
        .filter((device) => device.active === 1)
        .map((device) => ({
          key: device.id,
          locationId: device.id,
          place: device.place,
        }));
      setLocationDataSource(dataSource);
    }
  }, [devices]);
  //////////////////////////////////////////////////

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 30 }}>
      <Row gutter={16}>
        <Col span={6}>
          <h1 style={{ color: "white" }}>Possible locations</h1>
          <Table
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={locationColumns}
            dataSource={locationDataSource}
            style={{ marginTop: 30 }}
            pagination={false}
            scroll={{ y: 500 }}
          />
        </Col>
        <Col span={2}></Col>
        <Col span={8}>
          <h1 style={{ color: "white" }}>User</h1>
          <div>
            <InputField
              name="name2"
              type="text"
              placeholder="Nick name"
              onChange={handleUserInputChange}
            />
            <InputField
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleUserInputChange}
            />
            <InputField
              name="surname"
              type="text"
              placeholder="Surname"
              onChange={handleUserInputChange}
            />
            <InputField
              name="email"
              type="email"
              placeholder="E-mail"
              onChange={handleUserInputChange}
            />
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 5 }}>
                <label style={{ fontSize: "1em", color: "white" }}>
                  Phone Number
                </label>
              </div>
              <PhoneInput
                country={selectedCountry}
                onCountryChange={handleCountryChange}
                name="phone"
                value={userInput.phone}
                onChange={handlePhoneChange}
                required
              />
            </div>
            <InputField
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleUserInputChange}
            />
            <InputField
              name="telegram"
              type="text"
              placeholder="Telegram"
              onChange={handleUserInputChange}
            />
            <InputField
              name="viber"
              type="text"
              placeholder="Viber"
              onChange={handleUserInputChange}
            />
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 5 }}>
                <label style={{ fontSize: "1em", color: "white" }}>
                  Something else
                </label>
              </div>
              <TextArea
                name="somthingElse"
                rows={4}
                onChange={handleUserInputChange}
              />
            </div>
          </div>
        </Col>
        <Col span={2}></Col>
        <Col span={6}>
          <h1 style={{ color: "white" }}>Notifications</h1>
          <InputField
            name="telegram"
            type="text"
            placeholder="Telegram"
            onChange={handleNotificationsChange}
            disabled={true}
          />
          <InputField
            name="viber"
            type="text"
            placeholder="Viber"
            onChange={handleNotificationsChange}
            disabled={true}
          />
          <InputField
            name="sms"
            type="text"
            placeholder="SMS"
            onChange={handleNotificationsChange}
            disabled={true}
          />
          <InputField
            name="email"
            type="text"
            placeholder="Email"
            onChange={handleNotificationsChange}
            disabled={true}
          />
        </Col>
      </Row>
      <div style={{ textAlign: "right", width: "100%" }}>
        <Button
          color="primary"
          variant="solid"
          disabled={!isValid()}
          style={{ padding: "0px 100px" }}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
