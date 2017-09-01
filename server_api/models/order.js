var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
  _id: { type : String, required: true},
  username: {type: String, required: true},
  seriesId: {type: mongoose.Schema.ObjectId, ref: 'Series', required: true},
  state: {type: String, required: true, enum: ['prepay', 'paying', 'success', 'failed']},
  fee: {type: Number, required: true},
  time_start: {type: Date},
  time_end: {type: Date}
});

mongoose.model('Order', OrderSchema);