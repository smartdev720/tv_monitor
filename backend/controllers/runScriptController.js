const fs = require("fs");
const path = require("path");

exports.runIPTVSettings = async (req, res) => {
  try {
    const scriptParams = req.body;
    console.log(scriptParams);
    return res.status(200).json({ ok: true, message: "ok" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.runAnalogSettings = async (req, res) => {
  try {
    const scriptParams = req.body;
    const videoPath = path.join(__dirname, "../source/media/9", `/1365.ts`);
    console.log(videoPath);
    fs.access(videoPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send("Avatar not found");
      }
      res.sendFile(videoPath);
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
