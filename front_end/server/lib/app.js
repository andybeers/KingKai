const express = require('express');
const app = express();
const morgan = require('morgan');

const servers = require('./routes/servers');

app.use(morgan('dev'));

app.use('/api/servers', servers);

//eslint-disable-next-line
app.get('/', (req, res, next) => {
  res.send({ message: 'Hello world!'});
});


module.exports = app;