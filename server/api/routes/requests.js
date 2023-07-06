const express = require('express');
const router = express.Router();
const controller = require('../controllers/request');
const checkAuth = require('../middlewares/check-auth');

router.get('/', checkAuth, controller.getAll);

router.post('/', checkAuth, controller.add);

router.get('/:id', checkAuth, controller.get);

module.exports = router;
