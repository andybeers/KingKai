const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  cpuLoad: { type: Array, required: true },
  memoryUse: { type: Number, required: true },
  diskUse: {
    used: { type: Number, required: true },
    free: { type: Number, required: true }
  },
  topProcesses: { type: Array},
  dataStores: { type: Array }
});

module.exports = mongoose.model('Server', schema);