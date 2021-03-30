"use strict";
require("dotenv").config();
const { db } = require("../database/connection");
const insert = require("../queries/insert");
const select = require("../queries/select");
const update = require("../queries/update");
// Retrive all pending request
const pendingall = (req, res) => {
  const request_retrieve_pending_all =
    "SELECT COUNT(*) AS Pendings FROM tblrequest WHERE statusID = '1'";
  db.query(request_retrieve_pending_all, (err, result) => {
    if (err) {
      console.log("Inter Error", err);
    } else {
      res.json({
        message: "retrieve all request pending count successfull",
        result: result,
      });
    }
  });
};
//Retrieve request by status name
const request_retrieve_byStatus = (req, res) => {
  const status = req.params.status;
  db.query(
    "SELECT * FROM view_request_approve_disapprove where status = ? ",
    status,
    (err, result) => {
      if (err) {
        console.log("Inter Error", err);
        res.json({ message: "not successfull" });
      } else {
        res.json({
          message: "retrieve request by status successfull",
          result: result,
        });
      }
    }
  );
};
//Retrieve all Request
const request_retrieve_all = (req, res) => {
  db.query(select.request_retrieve_all, (err, result) => {
    if (err) {
      console.log("Inter Error", err);
      res.json({ message: "not successfull" });
    } else {
      res.json({ message: "retrieve all request successfull", result: result });
    }
  });
};
// Retrive user pending request
const request_retrieve_pending = (req, res) => {
  const id = req.params.userID;
  db.query(select.request_retrieve_pending, id, (err, result) => {
    if (err) {
      console.log("Inter Error", err);
    } else {
      res.json({
        message: "retrieve pending request of an specific user successfull",
        result: result,
      });
    }
  });
};
//Insert Request
const request_insert = (req, res) => {
  const { userID, certificateName, purpose, status } = req.body;
  db.query(
    insert.request_insert,
    [userID, certificateName, purpose, status],
    (err, result) => {
      if (err) {
        res.status(500).send("Insert  request internal Error");
        console.log("Insert  request internal Error", err);
      } else {
        res
          .status(201)
          .json({
            message: "Insert request successfull",
            result: result,
            auth: true,
          })
          .end();
      }
    }
  );
};
//Update Request status
const request_update_status = (req, res) => {
  const requestID = req.params.requestID;
  const { employeeID,status, barangayID_no } = req.body;

  db.query(
    "CALL sp_approve_disapprove_request(?,?,?,?)",
    [status, requestID, barangayID_no, employeeID],
    (err, result) => {
      if (err) {
        res.status(500).send("Update request status internal error");
        console.log("request err", err);
      } else {
        res.status(201).json({
          message: "Update request status successfull",
          result: result,
        });
      }
    }
  );
};

module.exports = {
  pendingall,
  request_retrieve_byStatus,
  request_retrieve_all,
  request_retrieve_pending,
  request_insert,
  request_update_status,
};
