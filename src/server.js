const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const user = require("./routes/userRoutes");
const request = require("./routes/requestRoutes");
const logs = require("./routes/logsRoutes");

/* Middel Wares */
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3002"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
//User
app.use("/api/user", user);
// User Request
app.use("/api/request", request);
// Logs
app.use("/api/logs", logs);

/*PORTS */
const port = 3001;
app.listen(port, () => {
  console.log("Listening on port: ", port);
});
