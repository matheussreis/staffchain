const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

router.get('/', checkAuth, controller.getAll);

router.get('/me', checkAuth, controller.get);

router.get('/processes', checkAuth, controller.availableProcesses);

router.get(
  '/started-requests',
  checkAuth,
  controller.startedRequests,
);

router.get(
  '/requests-to-review',
  checkAuth,
  controller.requestsToReview,
);

router.get('/:id', checkAuth, controller.get);

router.put('/:id', checkAuth, controller.update);

router.delete('/:id', checkAuth, controller.delete);

router.post('/signup', checkAuth, controller.signup);

router.post('/login', controller.login);

module.exports = router;
