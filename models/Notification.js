const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
  barberiaId:{
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);

