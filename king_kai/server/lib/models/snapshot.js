const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  HOST_ID: { type: String },
  disk: [{
    //Prevent mongoose from generating IDs for subdocuments
    _id: false,
    free: { type: Number },
    fstype: { type: String },
    inodesFree: { type: Number },
    inodesTotal: { type: Number },
    inodesUsed: { type: Number },
    inodesUsedPercent: { type: Number },
    path: { type: String },
    total: { type: Number },
    used: { type: Number },
    usedPercent: { type: Number }
  }],
  cpus: [{
    //Prevent mongoose from generating IDs for subdocuments
    _id: false,
    cpu: { type: String },
    guest: { type: Number },
    guestNice: { type: Number },
    idle: { type: Number },
    iowait: { type: Number },
    irq: { type: Number },
    nice: { type: Number },
    softirq: { type: Number },
    steal: { type: Number },
    stolen: { type: Number },
    system: { type: Number },
    user: { type: Number }
  }],
  memory: {
    swap: {
      free: { type: Number },
      sin: { type: Number },
      sout: { type: Number },
      total: { type: Number },
      used: { type: Number },
      usedPercent: { type: Number }
    },
    virtual: {
      active: { type: Number },
      available: { type: Number },
      buffers: { type: Number },
      cached: { type: Number },
      dirty: { type: Number },
      free: { type: Number },
      inactive: { type: Number },
      pagetables: { type: Number },
      shared: { type: Number },
      slab: { type: Number },
      swapcached: { type: Number },
      total: { type: Number },
      used: { type: Number },
      usedPercent: { type: Number },
      wired: { type: Number },
      writeback: { type: Number },
      writebacktmp: { type: Number },
    }
  }
});

module.exports = mongoose.model('Snapshot', schema);