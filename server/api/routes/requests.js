const express = require('express');
const router = express.Router();
const controller = require('../controllers/request');
const checkAuth = require('../middlewares/check-auth');
const fileUpload = require('../middlewares/file-upload');

router.get('/', checkAuth, controller.getAll);

router.post('/', checkAuth, controller.add);

router.get('/:id', checkAuth, controller.get);

router.put(
  '/:id/fields',
  checkAuth,
  fileUpload,
  controller.updateFields,
);

module.exports = router;
