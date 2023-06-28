const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const processRoutes = require('./api/routes/processes');
const requestRoutes = require('./api/routes/requests');
const userRoutes = require('./api/routes/users');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

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
