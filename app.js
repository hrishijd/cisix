const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const rateLimiterMiddleware = require("./rateLimitermiddleware");
const executeJScode = require("./api/routes/executeJScode");
const registerUser = require("../cisix/api/routes/userManagemnet");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

// You can proceed to define your Apollo server and logic here.
const fs = require("fs");
const path = require("path");
const gql = require("graphql-tag");



const typeDefs = gql(
    fs.readFileSync(path.resolve(__dirname, "./schemas/schema.graphql"), {
    encoding: "utf-8",
  })
);

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.json());

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

// To serve custom request queries
app.use("/executeJScode", executeJScode);

// handle register queries
app.use("/register", registerUser);

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

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs });
  const { url } = await startStandaloneServer(server);
  console.log(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
}

startApolloServer();

const port = process.env.DEV_PORT || 3000;
app.listen(port);

module.exports = app;
