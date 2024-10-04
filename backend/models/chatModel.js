const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Chat Schema
const ChatSchema = new Schema({
  chatName: {
    type: String,
    trim:true
  },
  isGroup: {
    type: Boolean,
    default:false
  },
  users:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  ] ,
  latestMessages: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
},
{
    timestamps:true
}
);
module.exports = mongoose.model('Chat', ChatSchema);
