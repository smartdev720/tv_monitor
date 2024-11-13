import moment from "moment";

export const convertTVType = (value) => {
  switch (value) {
    case "3":
      return "cable_settings";
    case "6":
      return "t2_settings";
    case "7":
      return "iptv_settings";
    case "9":
      return "analog_settings";
    default:
      return;
  }
};

export const convertTVTypeToType = (value) => {
  switch (value) {
    case "3":
      return "DVB-C";
    case "6":
      return "DVB-T2";
    case "7":
      return "IPTV";
    case "9":
      return "Analog";
    default:
      return;
  }
};

export const convertTVTypeToValue = (value) => {
  switch (value) {
    case "DVB-C":
      return "3";
    case "DVB-T2":
      return "6";
    case "IPTV":
      return "7";
    case "Analog":
      return "9";
    default:
      return;
  }
};

export const getForamtedModulationToDB = (input) => {
  const values = {
    16: "1",
    32: "2",
    64: "3",
    128: "4",
  };

  return values[input];
};

export const getForamtedModulationFromDB = (input) => {
  const values = {
    1: "16",
    2: "32",
    3: "64",
    4: "128",
    5: "256",
  };

  return values[input];
};

export const formatDeviceId = (id) => {
  return id.toString().padStart(6, "0");
};

export const getDateWithISO = (date) => {
  const localDate = new Date(date.$d);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  const selectedDate = localDate.toISOString().split("T")[0];
  return selectedDate;
};

export const getPrevday = (date) => {
  const localDate = moment(date.$d || date);
  if (!localDate.isValid()) {
    console.error("Invalid date provided");
    return null;
  }
  localDate.subtract(1, "days");
  return localDate.format("YYYY-MM-DD");
};

export const getNextday = (date) => {
  const localDate = moment(date.$d || date);
  if (!localDate.isValid()) {
    console.error("Invalid date provided");
    return null;
  }
  localDate.add(1, "days");
  return localDate.format("YYYY-MM-DD");
};

export const getTime = (date) => {
  const dateObj = new Date(date);
  const day = dateObj.toISOString().split("T")[0];
  const time = dateObj.toISOString().split("T")[1].split(".")[0];
  return `${day} ${time}`;
};

export const parseTime = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const formatTime = (totalSeconds) => {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export const formatDelay = (delay) => {
  const seconds = Math.abs(delay / 25);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2);
  const sign = delay >= 0 ? "+" : "-";
  return `${sign}${minutes}:${String(remainingSeconds).padStart(5, "0")}`;
};
