"use strict";
const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

router.use(function (req, res, next) {
  console.log(req.url, "@", Date.now());
  next();
});

//Update settings
router.put("/update", settingsController.update_settings);
//Update settings
router.put("/image", settingsController.update_image);
//Update settings
router.put("/barangayinfo", settingsController.update_barangayinfo);
//Retrieve Settings
router.get("/retrieve", settingsController.retrieve_settings);

module.exports = router;
