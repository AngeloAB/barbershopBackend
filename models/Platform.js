const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema({
  web: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
});

module.exports = mongoose.model('Platform', PlatformSchema);