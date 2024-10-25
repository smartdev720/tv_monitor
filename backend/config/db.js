const mysql = require("mysql2");

// Create a connection
const db = mysql.createConnection({
  host: "localhost",
  port: "3307",
  user: "root",
  password: "Receiver_CRT1081",
  database: "monitor",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});

// Handle disconnections gracefully
process.on("SIGINT", () => {
  connection.end((err) => {
    console.log("Disconnected from the database.");
    process.exit(err ? 1 : 0);
  });
});

module.exports = db;
