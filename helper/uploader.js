const multer = require("multer");
const fs = require("fs");

module.exports = {
  uploader: (directory) => {
    const defaultDir = "./public";

    const storageUploader = multer.diskStorage({
      destination: (req, file, cb) => {
        const pathDir = directory ? defaultDir+directory : defaultDir;
        if (fs.existsSync(pathDir)) {
          cb(null, pathDir);
        } else {
          fs.mkdir(pathDir, (err) => {
            if (err) {
              console.log("Error create directory", err);
            }
            cb(err, pathDir);
          });
        };
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });

    const fileFilter = (req, file, cb) => {
      if (
        file.originalname.toLowerCase().includes(".png") ||
        file.originalname.toLowerCase().includes(".jpg") ||
        file.originalname.toLowerCase().includes(".jpeg")
      ) {
        cb(null, true);
      } else {
        cb(new Error("Your file extension are denied. Only PNG, JPG/JPEG"))
      }
    };

    return multer({
      storage: storageUploader,
      fileFilter,
    });
  },
}