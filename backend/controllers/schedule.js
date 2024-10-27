const queryAsync = require("../config/queryAsync");

exports.getAll = async (req, res) => {
  try {
    const sql = "SELECT * FROM schedules ;";
    const schedules = await queryAsync(sql, []);
    return res.status(200).json({ ok: true, data: schedules });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.insertOne = async (req, res) => {
  try {
    const { type, text, date } = req.body;
    const retext = JSON.stringify(text);
    const sql = "INSERT INTO schedules (type, text, date) VALUES (?, ?, ?) ;";
    let result;
    if (date) {
      result = await queryAsync(sql, [type, retext, date]);
    } else {
      result = await queryAsync(sql, [type, retext, null]);
    }
    if (result) {
      return res.status(200).json({ ok: true, message: "Saved successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { id, type, text, date } = req.body;
    const retext = JSON.stringify(text);
    const sql = "UPDATE schedules SET type = ?, text = ?, date = ? ;";
    let result;
    if (date) {
      result = await queryAsync(sql, [type, retext, date]);
    } else {
      result = await queryAsync(sql, [type, retext, null]);
    }
    if (result) {
      return res.status(200).json({ ok: true, message: "Edited successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
