const fs = require('fs');
const multer = require('multer');
const { getfieldsByRequestId } = require('../controllers/request');
const { getfieldsByProcessId } = require('../controllers/process');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const mainFolder = req.params.id ?? req.requestId;
    const folder = `${process.env.UPLOAD_DIR_PATH}/${mainFolder}/${file.fieldname}/`;

    const folderExists = fs.existsSync(folder);
    if (!folderExists) {
      return fs.mkdir(folder, { recursive: true }, (error) =>
        callback(error, folder),
      );
    }

    callback(null, folder);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  let validMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'image/jpeg',
    'image/png',
    'image/jpeg',
    'application/vnd.apple.pages',
  ];

  if (validMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5e7,
  },
});

const getFieldsHandler = async (params) => {
  if (params.id) {
    return getfieldsByRequestId(params.id);
  }

  if (params.processId) {
    return getfieldsByProcessId(params.processId);
  }

  throw new Error('Invalid Id field.');
};

module.exports = async (req, res, next) => {
  try {
    const fieldsData = await getFieldsHandler(req.params);
    const fields = fieldsData.map((field) => ({
      name: field.id,
      maxCount: field.type === 'file' ? 1 : 0,
    }));

    upload.fields(fields)(req, res, next);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
