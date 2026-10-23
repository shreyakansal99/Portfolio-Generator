import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { protect } from "../middleware/auth";
import upload from "../middleware/upload";
import { uploadResume } from "../controllers/resumeController";

const router = Router();

// Wraps multer so its errors come back as clean JSON messages
const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      const message =
        err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
          ? "File is too large. Maximum size is 5 MB."
          : err.message;
      res.status(400).json({ message });
      return;
    }
    next();
  });
};

router.post("/upload", protect, handleUpload, uploadResume);

export default router;