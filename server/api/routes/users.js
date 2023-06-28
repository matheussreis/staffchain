const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

router.get('/', checkAuth, controller.getAll);

router.get('/:id', checkAuth, controller.get);

router.post('/signup', checkAuth, controller.signup);

router.post('/login', controller.login);

module.exports = router;
