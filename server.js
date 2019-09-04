const express = require('express');
const userRouter = require('./users/userRouter')

const server = express();

server.use(express.json());
server.use(logger);

server.use('/users', userRouter);

server.get('/', (req, res) => {
  res.send("Hello world!")
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url}`
  );
  next();
};

module.exports = server;