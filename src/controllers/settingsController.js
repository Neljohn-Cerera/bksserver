"use strict";
require("dotenv").config();
const { db } = require("../database/connection");

// update settings
const update_settings = (req, res) => {
  const { status, barangayID_no } = req.body;
  db.query(
    "CALL sp_update_settings(?,?)",
    [status, barangayID_no],
    (err, result) => {
      if (err) {
        console.log("update setings Error", err);
      } else {
        res
          .json({
            message: "update settings succesfull",
            result: result,
          })
          .status(200);
      }
    }
  );
};
// update barangay image
const update_image = (req, res) => {
  console.log("req files ", req.files);
};
// Retrieve settings
const retrieve_settings = (req, res) => {
  db.query("SELECT * FROM view_settings", (err, result) => {
    if (err) {
      console.log("retrieve setings Error", err);
    } else {
      res
        .json({
          message: "retrieve succesfull",
          result: result,
        })
        .status(200);
    }
  });
};

// update barangayinfo
const update_barangayinfo = (req, res) => {
  const { barangayname } = req.body;
  db.query(
    "CALL sp_update_settings_barangayinfo(?)",
    [barangayname],
    (err, result) => {
      if (err) {
        console.log("update setings Error", err);
      } else {
        res
          .json({
            message: "update barangay info succesfull",
            result: result,
          })
          .status(200);
      }
    }
  );
};

module.exports = {
  update_settings,
  update_image,
  retrieve_settings,
  update_barangayinfo,
};
