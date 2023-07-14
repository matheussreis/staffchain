const { default: mongoose } = require('mongoose');

module.exports = (req, res, next) => {
  try {
    const newRequestId = new mongoose.Types.ObjectId();
    req.requestId = newRequestId;
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
