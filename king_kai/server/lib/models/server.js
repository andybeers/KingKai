const mongoose = require('mongoose')
const Schema = mongoose.Schema

//TODO change 'server' to 'host'
const schema = new Schema({
  bootTime: { type: Number },
  hostid: { type: String },
  hostname: { type: String },
  kernelVersion: { type: String },
  os: { type: String },
  platform: { type: String },
  platformFamily: { type: String },
  platformVersion: { type: String },
  procs: { type: Number },
  uptime: { type: Number },
  virtualizationRole: { type: String },
  virtualizationSystem: { type: String },
})

// hostid vs. hostname?
// uptime as a percent?

module.exports = mongoose.model('Server', schema)
