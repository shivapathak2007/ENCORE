const multer = require('multer');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept specific formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'text/plain', 
    'text/markdown',
    'image/jpeg',
    'image/png',
    'audio/mpeg',
    'audio/wav',
    'audio/webm',
    'audio/x-m4a',
    'video/mp4',
    'video/webm'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: PDF, DOCX, PPTX, TXT, MD, Images, Audio, Video.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
