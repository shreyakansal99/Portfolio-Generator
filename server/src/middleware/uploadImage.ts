import multer from "multer";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG or WEBP images are allowed"));
    }
  },
});