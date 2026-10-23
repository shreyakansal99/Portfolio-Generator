import { Router, Request, Response, NextFunction } from "express";
import { protect } from "../middleware/auth";
import { getMyPortfolio, saveMyPortfolio, publishPortfolio, uploadPhoto, saveTheme, uploadProjectImage} from "../controllers/portfolioController";
import uploadImage from "../middleware/uploadImage";
import multer from "multer";

const handlePhoto = (req: Request, res: Response, next: NextFunction) => {
  uploadImage.single("photo")(req, res, (err) => {
    if (err) {
      const message =
        err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
          ? "Image is too large. Maximum size is 2 MB."
          : err.message;
      res.status(400).json({ message });
      return;
    }
    next();
  });
};

const router = Router();

router.get("/me", protect, getMyPortfolio);
router.put("/me", protect, saveMyPortfolio);
router.post("/photo", protect, handlePhoto, uploadPhoto);
router.patch("/publish", protect, publishPortfolio);
router.patch("/theme", protect, saveTheme);
router.post("/project-image", protect, handlePhoto, uploadProjectImage);

export default router;