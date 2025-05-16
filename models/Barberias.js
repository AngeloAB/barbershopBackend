const mongoose = require('mongoose');

const BarberiasSchema = new mongoose.Schema({
  name: { type: String, required: true },
  propietarioId: { type: String, required: true },
  propietario: { type: String, required: true },
  pais: { type: String, required: true },
  telefono: { type: String, },
});

module.exports = mongoose.model('Barberias', BarberiasSchema);
