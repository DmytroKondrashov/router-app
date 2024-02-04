const mongoose = require('mongoose');
const requestResponseSchema = new mongoose.Schema({
  request: { type: Object, required: true },
  response: { type: Object, required: true },
});
module.exports = mongoose.model('RequestResponse', requestResponseSchema);
