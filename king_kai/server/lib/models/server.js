const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  cpuLoad: { type: Array },
  memoryUse: { type: Number },
  diskUse: {
    used: { type: Number },
    free: { type: Number }
  },
  topProcesses: { type: Array},
  dataStores: { type: Array }
});

module.exports = mongoose.model('Server', schema);