const multer = require('multer'); 
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  let ext = path.extname(file.originalname);

  if (allowedExtensions.includes(ext.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('File type is not supported'), false);
  }
};


const fields = { images: { maxCount: 4 } };

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB image size limit
  fields: fields
});

module.exports = upload;