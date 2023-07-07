const multer = require('multer');
const { getfieldsByRequestId } = require('../controllers/request');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, callback) => {
    const fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf('.') + 1,
    );

    const fileName = `${file.fieldname}.${fileExtension}`;
    callback(null, fileName);
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

module.exports = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const requestFields = await getfieldsByRequestId(requestId);
    const fields = requestFields.map((field) => ({
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
