const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthdate: { type: Date, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  phone: { type: String },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  department: { type: String },
  role: { type: String },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
