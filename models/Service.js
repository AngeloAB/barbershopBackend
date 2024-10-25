const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  barberiaId:{
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Service', ServiceSchema);
