const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));

//eslint-disable-next-line
app.get('/', (req, res, next) => {
  res.send({ message: 'Hello world!'});
});

module.exports = app;