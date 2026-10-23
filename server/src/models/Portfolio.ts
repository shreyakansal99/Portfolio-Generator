import mongoose, { Schema } from "mongoose";

const portfolioSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one portfolio per user
    },
    personal: {
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      summary: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    experience: [
      {
        _id: false,
        company: String,
        role: String,
        location: String,
        start: String,
        end: String,
        highlights: [String],
      },
    ],
    education: [
      {
        _id: false,
        institution: String,
        degree: String,
        field: String,
        start: String,
        end: String,
        grade: String,
      },
    ],
    projects: [
      {
        _id: false,
        name: String,
        description: String,
        tech: [String],
        github: String,
        live: String,
        image: String,
      },
    ],
    skills: [String],
    certifications: [
      {
        _id: false,
        name: String,
        issuer: String,
        year: String,
      },
    ],
    slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    isPublished: { type: Boolean, default: false },
    photoUrl: { type: String, default: "" },
    theme: {
      accent: { type: String, default: "#4f46e5" },
      dark: { type: Boolean, default: false },
      template: { type: String, enum: ["warm", "creative", "dark"], default: "warm" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);