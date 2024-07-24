const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../../controllers/book.controller");

router.get("/", CONTROLLER.checkBook);

module.exports = router;
