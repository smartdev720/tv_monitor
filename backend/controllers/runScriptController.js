const queryAsync = require("../config/queryAsync");

exports.runIPTVSettings = async (req, res) => {
  try {
    const scriptParams = req.body;
    return res
      .status(200)
      .json({ ok: true, videoSrc: "http://localhost:5000/video/9/1365" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.runAnalogSettings = async (req, res) => {
  try {
    const { device_id, frequency, standart } = req.body;
    const sql =
      "SELECT * FROM Dat_9 WHERE device_id = ? AND data_cmd = ? AND time_dat != NULL ;";
    const video = await queryAsync(sql, [device_id, frequency]);
    if (video.length == 0) {
      return res.json({ ok: false, message: "Video not found" });
    }
    const videoPath = path.join(
      __dirname,
      "../storage/media/9",
      `/${video[0].cnt}.mpg`
    );
    if (!videoPath) {
      return res.json({ ok: false, message: "Video not found" });
    }
    return res.status(200).json({
      ok: true,
      videoSrc: "http://localhost:5000/video/1365",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.runT2Settings = async (req, res) => {
  try {
    const scriptParams = req.body;
    console.log(scriptParams);
    return res.status(200).json({ ok: true, message: "ok" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.runCableSettings = async (req, res) => {
  try {
    const scriptParams = req.body;
    console.log(scriptParams);
    return res.status(200).json({ ok: true, message: "ok" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
