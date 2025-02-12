const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const processRoutes = require('./api/routes/processes');
const requestRoutes = require('./api/routes/requests');
const userRoutes = require('./api/routes/users');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  dbName: 'staffchain',
});

app.use('/file', express.static(process.env.UPLOAD_DIR_PATH));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, POST, PATCH, DELETE, GET',
    );
    return res.status(200).json({});
  }

  next();
});

app.use('/process', processRoutes);
app.use('/request', requestRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
