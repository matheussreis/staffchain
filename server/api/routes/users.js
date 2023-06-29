const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

router.get('/', checkAuth, controller.getAll);

router.get('/me', checkAuth, controller.get);

router.put('/me', checkAuth, controller.update);

router.get('/:id', checkAuth, controller.get);

router.put('/:id', checkAuth, controller.update);

router.delete('/:id', checkAuth, controller.delete);

router.post('/signup', checkAuth, controller.signup);

router.post('/login', controller.login);

module.exports = router;
