const mongoose = require('mongoose');

const requestTreeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
});

const processSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: { type: String, required: false },
  fieldSet: [
    {
      label: { type: String, required: true },
      required: { type: Boolean, default: true },
      type: { type: String, required: true },
    },
  ],
  requestTree: [requestTreeSchema],
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Process', processSchema);
