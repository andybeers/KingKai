const mongoose = require('mongoose')
mongoose.Promise = Promise

// const tcpMongoURI = `${process.env.KINGKAI_MONGODB_1_PORT}/KingKai`;
// const mongoURI = tcpMongoURI.replace('tcp', 'mongodb');
const mongoURI = process.env.KINGKAI_MONGODB_1_PORT || 'mongodb://localhost/KingKai'

mongoose.connect(mongoURI)

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ', mongoURI)
})

mongoose.connection.on('error', err => {
  console.log('Mongoose default connection error: ', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection closed.')
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection closed through app termination.')
    process.exit(0)
  })
})

module.exports = mongoose.connection
