const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../../controllers/member.controller");

router.get("/", CONTROLLER.getUser);

module.exports = router;
