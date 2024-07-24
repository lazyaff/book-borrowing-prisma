const express = require("express");
const router = express.Router();
const MEMBER_ROUTER = require("./member.route");
const BOOK_ROUTER = require("./book.route");
// const BORROWING_ROUTER = require("./borrowing.route");

router.use("/member", MEMBER_ROUTER);
router.use("/book", BOOK_ROUTER);
// router.use("/borrowing", BORROWING_ROUTER);

module.exports = router;
