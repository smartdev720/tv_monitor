const queryAsync = require("../config/queryAsync");
const { parse } = require("json2csv");

const flattenData = (data) => {
  const flattened = [];

  data.forEach((row) => {
    const hour = parseInt(row.hour, 10);
    const minuteAndGroupId = row.minuteAndGroupId;

    minuteAndGroupId.forEach((item) => {
      flattened.push({
        hour,
        minute: item.minute,
        groupId: item.groupId,
      });
    });
  });

  return flattened;
};

const convertToCsv = (flattenedData) => {
  const csv = parse(flattenedData);
  return csv;
};

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
    const flattenedData = flattenData(text);
    const outputCsv = convertToCsv(flattenedData);
    const sql = "INSERT INTO schedules (type, text, date) VALUES (?, ?, ?) ;";
    let result;
    if (date) {
      result = await queryAsync(sql, [type, outputCsv, date]);
    } else {
      result = await queryAsync(sql, [type, outputCsv, null]);
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
    const flattenedData = flattenData(text);
    const outputCsv = convertToCsv(flattenedData);
    const sql =
      "UPDATE schedules SET type = ?, text = ?, date = ? WHERE id = ? ;";
    let result;
    if (date) {
      result = await queryAsync(sql, [type, outputCsv, date, id]);
    } else {
      result = await queryAsync(sql, [type, outputCsv, null, id]);
    }
    if (result) {
      return res.status(200).json({ ok: true, message: "Edited successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
