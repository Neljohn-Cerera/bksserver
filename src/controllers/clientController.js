"use strict";
require("dotenv").config();
const { db, pool } = require("../database/connection");
const jwt = require("jsonwebtoken");

//Note: dont use res.send two times in a single request

//Update from client
const client_update = (req, res) => {
  const { fullName, age, gender, birthDate, address, civilStatus } = req.body;
  const id = req.params.userID;
  db.query(
    "CALL sp_update_client(?,?,?,?,?,?,?)",
    [fullName, age, gender, birthDate, address, civilStatus, id],
    (err, result) => {
      if (err) {
        console.log("Internal Error", err);
        res.status(500).json({ messgae: "Internal error" });
      } else {
        const userID = id;
        const token = jwt.sign({ userID }, process.env.SECRET_KEY);
        res.header("auth-token", token).status(201).json({
          message: "Cilent updated Successly",
          result: result,
          auth: true,
        });
        console.log("Client updated Successly");
      }
    }
  );
};

module.exports = {
  client_update,
};
