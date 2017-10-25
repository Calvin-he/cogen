'use strict';

const mongoose = require('mongoose');

const _PronounSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  audioPath: {type: String, required: true},
  countryOfReader: {type: String},
  sexOfReader: {type: String, enum: ['m', 'f']}
});

const WordSchema = new mongoose.Schema({
  word: { type : String, unique: true, trim : true, required: true },
  pronouns: {type: [_PronounSchema]},
  created: {type: Date, default: Date.now },
  updated: {type: Date, default: Date.now },
  _forvoResults: {type: mongoose.SchemaTypes.Mixed},
});

mongoose.model('Word', WordSchema);