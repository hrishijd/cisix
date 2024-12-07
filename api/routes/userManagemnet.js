var express = require("express");
var registerUser = require("../../controller/userCreate");

var router = express.Router();

router.post("/", function (req, res) {
  registerUser(req, res);
});

module.exports = router;
