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
