import { Request, Response } from "express";
import Portfolio from "../models/Portfolio";
import { AuthRequest } from "../middleware/auth";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

// GET /api/portfolio/me
export const getMyPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.userId }).lean();

    if (!portfolio) {
      res.json({ portfolio: null, slug: null, isPublished: false, photoUrl: "", theme: { accent: "#4f46e5", dark: false }, });
      return;
    }

    const { personal, experience, education, projects, skills, certifications } = portfolio;
    res.json({
      portfolio: { personal, experience, education, projects, skills, certifications },
      slug: portfolio.slug ?? null,
      isPublished: portfolio.isPublished,
      photoUrl: portfolio.photoUrl ?? "",
      theme: portfolio.theme ?? { accent: "#4f46e5", dark: false },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/portfolio/me
export const saveMyPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    // Only accept the fields we expect, nothing else from the request body
    const { personal, experience, education, projects, skills, certifications } = req.body;

    const safeProjects = Array.isArray(projects)
      ? projects.map((p: Record<string, unknown>) => ({
        ...p,
        image:
          typeof p.image === "string" && p.image.startsWith("https://res.cloudinary.com/")
            ? p.image
            : "",
      }))
      : projects;

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.userId },
      { $set: { personal, experience, education, projects: safeProjects, skills, certifications } },
      { upsert: true, returnDocument: "after", runValidators: true }
    ).lean();

    res.json({
      portfolio: {
        personal: portfolio.personal,
        experience: portfolio.experience,
        education: portfolio.education,
        projects: portfolio.projects,
        skills: portfolio.skills,
        certifications: portfolio.certifications,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not save portfolio" });
  }
};

// PATCH /api/portfolio/publish
export const publishPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const { slug, isPublished } = req.body;

    const cleanSlug = String(slug ?? "").toLowerCase().trim();
    if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(cleanSlug)) {
      res.status(400).json({
        message: "Link must be 3-30 characters: letters, numbers and hyphens only",
      });
      return;
    }

    const taken = await Portfolio.findOne({ slug: cleanSlug, user: { $ne: req.userId } });
    if (taken) {
      res.status(400).json({ message: "That link is already taken" });
      return;
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.userId },
      { $set: { slug: cleanSlug, isPublished: Boolean(isPublished) } },
      { returnDocument: "after" }
    ).lean();

    if (!portfolio) {
      res.status(400).json({ message: "Save your portfolio in the editor first" });
      return;
    }

    res.json({ slug: portfolio.slug, isPublished: portfolio.isPublished });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not publish portfolio" });
  }
};

// GET /api/public/:slug  (no login needed)
export const getPublicPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne({
      slug: String(req.params.slug).toLowerCase(),
      isPublished: true,
    }).lean();

    if (!portfolio) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }

    const { personal, experience, education, projects, skills, certifications } = portfolio;
    res.json({
      portfolio: { personal, experience, education, projects, skills, certifications },
      photoUrl: portfolio.photoUrl ?? "",
      theme: portfolio.theme ?? { accent: "#4f46e5", dark: false },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/portfolio/photo
export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "portfolio-photos",
            public_id: `user_${req.userId}`,
            overwrite: true,
            invalidate: true,
            transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
          },
          (error, uploaded) => {
            if (error || !uploaded) reject(error);
            else resolve(uploaded);
          }
        )
        .end(file.buffer);
    });

    await Portfolio.findOneAndUpdate(
      { user: req.userId },
      { $set: { photoUrl: result.secure_url } },
      { upsert: true }
    );

    res.json({ photoUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not upload the photo" });
  }
};

// PATCH /api/portfolio/theme
export const saveTheme = async (req: AuthRequest, res: Response) => {
  try {
    const { accent, dark, template } = req.body;

    // Strict hex check, since this value ends up inside a style attribute
    if (typeof accent !== "string" || !/^#[0-9a-fA-F]{6}$/.test(accent)) {
      res.status(400).json({ message: "Invalid color" });
      return;
    }

    if (!["warm", "creative", "dark"].includes(template)) {
      res.status(400).json({ message: "Invalid template" });
      return;
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.userId },
      { $set: { "theme.accent": accent, "theme.dark": Boolean(dark), "theme.template": template } },
      { returnDocument: "after" }
    ).lean();

    if (!portfolio) {
      res.status(400).json({ message: "Save your portfolio first" });
      return;
    }

    res.json({ theme: portfolio.theme });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not save theme" });
  }
};

// POST /api/portfolio/project-image
export const uploadProjectImage = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "portfolio-projects",
            transformation: [{ width: 1200, height: 800, crop: "limit" }],
          },
          (error, uploaded) => {
            if (error || !uploaded) reject(error);
            else resolve(uploaded);
          }
        )
        .end(file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not upload the image" });
  }
};