const path = require("path");

const multer = require("multer");

const Errors = require("../errors");

function fileFilter(req, file, cb) {
  const acceptedFileTypes = ["jpeg", "png"];

  const fileType = file.mimetype.split("/")[1];
  if (!acceptedFileTypes.includes(fileType)) {
    cb(new Errors.BadRequestError("Unaccepted File type"));
  }

  cb(null, true); // Accept otherwise
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const fileType = file.mimetype.split("/")[1];
    const fileName = `${file.fieldname}-${uniqueSuffix}.${fileType}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image"
);

module.exports = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log(err);
    }

    // Everything went fine.
    next();
  });
};
