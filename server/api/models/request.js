const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  process: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Process',
    required: true,
  },
  starter: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    default: 'in-progress',
    enum: ['in-progress', 'done', 'waiting-for-info', 'closed'],
  },
  fields: [
    {
      fieldSetId: { type: mongoose.SchemaTypes.ObjectId },
      value: { type: String },
    },
  ],
  comments: [
    {
      authorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
      comment: { type: String },
    },
  ],
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);
