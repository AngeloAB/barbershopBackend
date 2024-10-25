const mongoose = require('mongoose');

const MembresiaSchema = new mongoose.Schema({
  barberiaId: { type: String, required: true },
  plan: { type: String, required: true },
  fechaInicio: { type: String, required: true },
  fechaFin: { type: String, required: true },
  estado: { type: String, required: true },
  pagado: { type: Boolean, required: true },
});

module.exports = mongoose.model('Membresia', MembresiaSchema);
