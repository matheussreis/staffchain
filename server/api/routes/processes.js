const express = require('express');
const router = express.Router();
const controller = require('../controllers/process');
const checkAuth = require('../middlewares/check-auth');

router.post('/', checkAuth, controller.add);

module.exports = router;
