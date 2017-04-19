const express = require('express');
const app = express();
const morgan = require('morgan');

const servers = require('./routes/servers');
const errorHandler = require('./error-handler');

//Logging
app.use(morgan('dev'));

app.use('/api/servers', servers);

app.use(errorHandler);


module.exports = app;