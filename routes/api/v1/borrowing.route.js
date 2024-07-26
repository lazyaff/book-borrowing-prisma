const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../../controllers/borrowing.controller");

router.post("/borrow", CONTROLLER.borrowBook);
router.post("/return", CONTROLLER.returnBook);

module.exports = router;
