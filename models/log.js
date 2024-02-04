const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  method: String,
  path: String,
  request: Object,
  response: Object,
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
