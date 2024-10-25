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
