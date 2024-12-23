const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const rateLimiterMiddleware = require("./rateLimitermiddleware");
const executeJScode = require("./api/routes/executeJScode");
const queryblockdetails = require("./api/routes/queryBlockDetails");

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// To handle CORS Errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, GET, POST, DELETE, OPTIONS, PATCH"
    );
    return res.status(200).json({});
  }
  next();
});

// Handle Rate Limit
app.use(rateLimiterMiddleware);

// query block details
app.use("/", queryblockdetails);

// To serve custom request queries
app.use("/executeJScode", executeJScode);

// To Handle 404 Errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// To handle internal server errors 500
app.use((error, req, res, next) => {
  // Added `next` to maintain proper middleware signature
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const port = process.env.DEV_PORT || 3000;
app.listen(port);

module.exports = app;
