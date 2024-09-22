const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Message Schema
const MessageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User schema
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  message: {
    type: String,
    required: true
  },

},{
    timestamps:true
});

module.exports = mongoose.model('Message', MessageSchema);
