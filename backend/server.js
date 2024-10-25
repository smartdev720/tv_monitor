const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const deviceRoutes = require("./routes/deviceRoutes");
const sequenceRoutes = require("./routes/sequenceRoutes");
const analogSettingsRoutes = require("./routes/analogSettingsRoutes");
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
