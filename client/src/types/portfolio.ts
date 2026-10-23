export interface Personal {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  grade: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface PortfolioData {
  personal: Personal;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
}

export const emptyPortfolio: PortfolioData = {
  personal: {name: "", title: "", email: "", phone: "", location: "", summary: "", linkedin: "", github: "", website: ""},
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
};

export const TEMPLATE_IDS = ["warm", "creative", "dark"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  warm: "Warm",
  creative: "Creative",
  dark: "Dark",
};

export interface Theme {
  accent: string;
  dark: boolean;
  template: TemplateId;
}

export const defaultTheme: Theme = { accent: "#4f46e5", dark: false, template: "warm" };