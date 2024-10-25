const mongoose = require('mongoose');

const TurnSchema = new mongoose.Schema({
  number: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['sentado', 'espera', 'completado'], required: true },
  userId: { type: String, required: true },
  barberiaId:{
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Turn', TurnSchema);
