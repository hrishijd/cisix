import express from 'express';
import jwt from 'jsonwebtoken';
import executeJScode from '../../controller/executeJSonchain';

const router = express.Router();

function verifyToken(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (typeof bearerToken !== 'undefined') {
    const bearer = bearerToken.split(' ');
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.status(401).send('Token Is Not Valid');
  }
}

router.post('/', verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err) => {
        if (err) {
            res.status(403).send('Unauthorized User');
        } else {
            executeJScode(req, res);
        }
    });
});


export default router;
