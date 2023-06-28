const mongoose = require('mongoose');

const processSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: { type: String, required: false },
  fieldSet: [
    {
      id: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  requestTree: [
    {
      userId: { type: String, required: true },
      reportsTo: { type: String, required: false },
    },
  ],
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Process', processSchema);
