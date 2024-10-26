const queryAsync = require("../config/queryAsync");

exports.getAllChannels = async (req, res) => {
  try {
    const select_channels = "SELECT * FROM channels ;";
    const channels = await queryAsync(select_channels, []);
    return res.status(200).json({ ok: true, data: channels });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
