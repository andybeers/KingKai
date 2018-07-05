const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const servers = require('./routes/servers')
const snapshots = require('./routes/snapshots')
const errorHandler = require('./routes/error-handler')

//CORS
//TODO limit this more....
app.use(cors())

//Logging
app.use(morgan('dev'))

//Routers
app.use('/api/servers', servers)
app.use('/api/snapshots', snapshots)

//Error handling
app.use(errorHandler)

module.exports = app
