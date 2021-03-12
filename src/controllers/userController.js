"use strict";
require("dotenv").config();
const { db, pool } = require("../database/connection");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const select = require("../queries/select");

//Note: dont use res.send two times in a single request

//User Login
const user_login = (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  db.query(select.select_user_admin_username, user, function (err, result) {
    console.log("Login result : ", result);
    if (err) {
      console.log("Login Internal Error", err);
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].p_assword, (err, response) => {
        if (response) {
          const id = result[0].userID;
          const token = jwt.sign({ id }, process.env.SECRET_KEY, {
            // 5s = 5seconds, 1d = 1day, 5 = 5milliseconds, 5m = 5minutes
            expiresIn: "1h",
          });
          res.header("auth-token", token).status(200).json({
            auth: true,
            token: token,
            result: result,
            message: "Loggin Successfull",
          });
        } else {
          console.log("Wrong Password Combination error : ", err);
          res.json({
            message: "Wrong Password Combination",
            auth: false,
          });
        }
      });
    } else {
      res.status(404).json({ message: "User Doesn't Exist", auth: false });
    }
  });
};

//Retrieve users
const user_view = (req, res) => {
  db.query(select.select_user, (err, result) => {
    if (err) {
      console.log("Inter Error", err);
    } else {
      res.send(result);
    }
  });
};
//Retrieve users
const user_view_account = (req, res) => {
  db.query(select.select_user, (err, result) => {
    if (err) {
      console.log("Inter Error", err);
    } else {
      res.send(result);
    }
  });
};
//Retrieve specific user
const user_view_userID = (req, res) => {
  const id = req.params.userID;
  console.log("user id :", id);
  db.query(select.select_user_userID, id, (err, result) => {
    if (err) {
      console.log("Inter Error", err);
    } else {
      res.send(result);
    }
  });
};
//insert user account(household data , personal informations and passwords)
const user_create = (req, res) => {
  const {
    barangayID_no,
    houseHoldID_no,
    houseHold_role,
    fullName,
    age,
    gender,
    birthDate,
    birthPlace,
    civilStatus,
    address,
    userName,
    password,
  } = req.body;
  console.log("bday :",birthDate)

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log("hashing error :", err);
    } else {
      //MYSQL STORED PROCEDURE sp_insert_userAccount_insertLog
      db.query(
        "CALL sp_insert_userAccount_insertLog(?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          barangayID_no,
          houseHoldID_no,
          houseHold_role,
          fullName,
          age,
          gender,
          birthDate,
          birthPlace,
          civilStatus,
          address,
          userName,
          hash,
        ],
        (err, result) => {
          if (err) {
            res
              .status(500)
              .json({ message: "user_create_account internal error" });
            console.log("user_create_account internal error :", err);
          } else {
            res.status(201).json({
              message: "Account Created Successfully",
              result: result,
              auth: true,
            });
            console.log("Account Created Successfully");
          }
        }
      );
    }
  });
};
//Update user plus insert updatelogs
const user_update = (req, res) => {
  const {
    barangayID_no,
    houseHoldID_no,
    fullName,
    age,
    gender,
    birthPlace,
    civiStatus,
    address,
  } = req.body;
  const id = req.params.userID;
  db.query(
    "CALL sp_update_userInformations_updateLog(?,?,?,?,?,?,?,?,?,?)",
    [
      barangayID_no,
      houseHoldID_no,
      fullName,
      age,
      gender,
      birthPlace,
      civiStatus,
      address,
      id,
      "id2021",
    ],
    (err, result) => {
      if (err) {
        console.log("Internal Error", err);
        res.sendStatus(500).json({ messgae: "Internal error" });
      } else {
        const userID = id;
        const token = jwt.sign({ userID }, process.env.SECRET_KEY);
        res.header("auth-token", token).status(201).json({
          message: "User updated Successly",
          result: result,
          auth: true,
        });
        console.log("User updated Successly");
      }
    }
  );
};
//Delete user
const user_delete = (req, res) => {
  const { barangayID_no } = req.body;
  const id = req.params.userID;
  db.query(
    "CALL sp_delete_userInformations_deleteLog(?,?)",
    [id, barangayID_no],
    (err, result) => {
      if (err) {
        console.log("Internal Error", err);
        res.sendStatus(500).send("Internal error");
      } else {
        const userID = id;
        const token = jwt.sign({ userID }, process.env.SECRET_KEY);
        res.header("auth-token", token).status(200).json({
          message: "User Deleted successfully",
          auth: true,
        });
      }
    }
  );
};

module.exports = {
  user_login,
  user_view,
  user_create,
  user_view_userID,
  user_update,
  user_delete,
};