import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { extractText } from "../services/extractText";
import { parseResume } from "../services/parseResume";
import Portfolio from "../models/Portfolio";

// POST /api/resume/upload
export const uploadResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const text = await extractText(req.file);

    if (text.trim().length < 50) {
      res.status(422).json({
        message: "Could not read text from this file. It may be a scanned image.",
      });
      return;
    }

    const portfolio = await parseResume(text);

    await Portfolio.findOneAndUpdate(
      { user: req.userId },
      { $set: portfolio },
      { upsert: true, returnDocument: "after" }
    );

    res.json({ portfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not analyze your resume. Please try again." });
  }
};