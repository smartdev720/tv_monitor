const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const sequenceRoutes = require("./routes/sequenceRoutes");
const analogSettingsRoutes = require("./routes/analogSettingsRoutes");
const groupRoutes = require("./routes/groupsRoutes");
const channelsRoutes = require("./routes/channelsRoutes");
const t2settingsRoutes = require("./routes/t2settingsRoutes");
const t2pmtsRoutes = require("./routes/t2pmtsRoutes");
const cableSettingsRoutes = require("./routes/cableSettingsRoutes");
const cablePmtsRoutes = require("./routes/cablePmtsRoutes");
const iptvSettingsRoutes = require("./routes/iptvSettingsRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const runScriptRoutes = require("./routes/runScriptRoutes");
const extValRoutes = require("./routes/extValRoutes");
const compareRoutes = require("./routes/compare");
require("dotenv").config();
require("./config/passport")(passport);
const path = require("path");
const fs = require("fs");
const { getAllDevices } = require("./controllers/deviceController");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);

app.use("/compare", express.static(path.join(__dirname, "storage/media/99")));
app.get("/video/:folderName/:id", (req, res) => {
  const { folderName, id } = req.params;
  const videoPath = path.join(
    __dirname,
    "storage",
    "media",
    folderName,
    `${id}.m3u8`
  );

  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ message: "Video not found" });
  }

  res.sendFile(videoPath);
});

app.get("/api/files/:cnt/:device_id", (req, res) => {
  const { cnt, device_id } = req.params;
  const directoryPath = path.join(
    __dirname,
    "storage",
    "media",
    "99",
    cnt,
    device_id
  );
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ error: "Unable to read directory" });
    }
    res.json({ ok: true, data: files });
  });
});

app.use(
  "/storage/media/9",
  express.static(path.join(__dirname, "storage/media/9"))
);

app.get("/api/devices/all", getAllDevices);

app.use(
  "/api/devices",
  passport.authenticate("jwt", { session: false }),
  deviceRoutes
);
app.use(
  "/api/sequence",
  passport.authenticate("jwt", { session: false }),
  sequenceRoutes
);
app.use(
  "/api/analog-settings",
  passport.authenticate("jwt", { session: false }),
  analogSettingsRoutes
);
app.use(
  "/api/groups",
  passport.authenticate("jwt", { session: false }),
  groupRoutes
);
app.use(
  "/api/channels",
  passport.authenticate("jwt", { session: false }),
  channelsRoutes
);
app.use(
  "/api/t2settings",
  passport.authenticate("jwt", { session: false }),
  t2settingsRoutes
);
app.use(
  "/api/t2pmts",
  passport.authenticate("jwt", { session: false }),
  t2pmtsRoutes
);
app.use(
  "/api/cableSettings",
  passport.authenticate("jwt", { session: false }),
  cableSettingsRoutes
);
app.use(
  "/api/cablePmts",
  passport.authenticate("jwt", { session: false }),
  cablePmtsRoutes
);
app.use(
  "/api/iptv-settings",
  passport.authenticate("jwt", { session: false }),
  iptvSettingsRoutes
);

app.use(
  "/api/script-run",
  passport.authenticate("jwt", { session: false }),
  runScriptRoutes
);

app.use(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  userRoutes
);

app.use(
  "/api/schedules",
  passport.authenticate("jwt", { session: false }),
  scheduleRoutes
);

app.use(
  "/api/ext-val",
  passport.authenticate("jwt", { session: false }),
  extValRoutes
);

app.use(
  "/api/compare",
  passport.authenticate("jwt", { session: false }),
  compareRoutes
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
