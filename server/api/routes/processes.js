const express = require('express');
const router = express.Router();
const controller = require('../controllers/process');
const checkAuth = require('../middlewares/check-auth');

router.get('/', checkAuth, controller.getAll);

router.post('/', checkAuth, controller.add);

router.get('/:id', checkAuth, controller.get);

router.put('/:id', checkAuth, controller.update);

router.delete('/:id', checkAuth, controller.delete);

module.exports = router;
