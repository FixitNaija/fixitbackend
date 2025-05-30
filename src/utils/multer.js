const multer = require('multer'); 
const path = require('path');



module.exports = multer({
   storage: multer.memoryStorage({}),
   fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
     let ext = path.extname(file.originalname);

     if (allowedExtensions.includes(ext.toLowerCase())) {
       cb(null, true);
     } else {
       cb(new Error('File type is not supported'), false);
     }
   },
 });