const multer = require("multer");
const fs = require("fs");

const folderPath = "./files";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // If "files" folder doesn't exists, create one
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    "application/msword" ||
    "text/plain"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
});

module.exports = upload;
