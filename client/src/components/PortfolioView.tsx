import type { CSSProperties } from "react";
import { defaultTheme, type PortfolioData, type Theme } from "../types/portfolio";
import WarmTemplate from "./templates/WarmTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import DarkTemplate from "./templates/DarkTemplate";

export default function PortfolioView({ data, photoUrl, theme = defaultTheme }: { data: PortfolioData; photoUrl?: string; theme?: Theme; }) {
  const Template =
    theme.template === "creative"
      ? CreativeTemplate
      : theme.template === "dark"
        ? DarkTemplate
        : WarmTemplate;

  const dark = theme.template === "dark";

  return (
    <div
      className={`portfolio-theme min-h-screen ${dark ? "portfolio-dark" : ""}`}
      style={{ "--accent": theme.accent } as CSSProperties}
    >
      <Template data={data} photoUrl={photoUrl} />
    </div>
  );
}