const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  date: { type: String, required: true },
  service: { type: String, required: true },
  amount: { type: Number, required: true },
  barberiaId:{
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Sale', SaleSchema);
