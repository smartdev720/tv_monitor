const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
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
const runScriptRoutes = require("./routes/runScriptRoutes");
require("dotenv").config();
require("./config/passport")(passport);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Routes
app.use("/api/devices", deviceRoutes);
app.use("/api/sequence", sequenceRoutes);
app.use("/api/analog-settings", analogSettingsRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/channels", channelsRoutes);
app.use("/api/t2settings", t2settingsRoutes);
app.use("/api/t2pmts", t2pmtsRoutes);
app.use("/api/cableSettings", cableSettingsRoutes);
app.use("/api/cablePmts", cablePmtsRoutes);
app.use("/api/iptv-settings", iptvSettingsRoutes);
app.use("/api/script-run", runScriptRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
