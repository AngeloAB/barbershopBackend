const mongoose = require('mongoose');

const PlanesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  funciones: { type: [String], required: true },
});

module.exports = mongoose.model('Planes', PlanesSchema);