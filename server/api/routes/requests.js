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

router.get(
  '/:id/file/:fileId/download',
  checkAuth,
  controller.download,
);

router.post('/:id/approve', checkAuth, controller.approve);

router.post('/:id/moreinfo', checkAuth, controller.moreInfo);

router.post('/:id/close', checkAuth, controller.close);

router.post('/:id/comment', checkAuth, controller.addComment);

module.exports = router;
