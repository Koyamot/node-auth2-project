const express = require('express');
const cors = require("cors");
const helmet = require("helmet");


const server = express();

server.use(express.json())
server.use(cors());
server.use(helmet());
server.use(logger)

const usersRouter = require("./users/users-router.js")
const authRouter = require("./auth/auth-router.js")

server.get('/', (req, res) => {
    res.send(`<h2>"Up! Up! And away!!!"</h2>`);
  });

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);
  


function logger(req, res, next) {
    console.log(`Method: ${req.method}, Timestamp: [${new Date().toISOString()}], Request URL: "${req.url}"`)
    next();
  }
  
  module.exports = server;