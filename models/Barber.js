const mongoose = require('mongoose');

const BarberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  barberiaId:{
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Barber', BarberSchema);
