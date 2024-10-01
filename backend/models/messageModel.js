const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim:true
  },

},{
    timestamps:true
});

module.exports = mongoose.model('Message', MessageSchema);
