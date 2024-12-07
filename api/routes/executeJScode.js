var express = require('express');
var jwt = require('jsonwebtoken');
var aggregateInputs = require('../../controller/executeJSonchain');

var router = express.Router();

function verifyToken(req, res, next) {
  var bearerToken = req.headers.authorization;
  if (typeof bearerToken !== 'undefined') {
    var bearer = bearerToken.split(' ');
    var token = bearer[1];
    req.token = token;
    next();
  } else {
    res.status(401).send('Token Is Not Valid');
  }
}

router.post('/', verifyToken, function(req, res) {
    jwt.verify(req.token, process.env.SECRET_KEY, function(err) {
        if (err) {
            res.status(403).send('Unauthorized User');
        } else {
            aggregateInputs(req, res);
        }
    });
});

module.exports = router;
