var express = require('express');
var aggregateInputs = require('../../controller/executeJSonchain');

var router = express.Router();

router.post('/', function(req, res) {
  aggregateInputs(req, res);
});

module.exports = router;
