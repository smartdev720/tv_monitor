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