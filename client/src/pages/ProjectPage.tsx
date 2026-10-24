import { useEffect, useState, type CSSProperties } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { toHref } from "../components/templates/parts";
import { defaultTheme, emptyPortfolio, TEMPLATE_IDS, type PortfolioData, type Project, type TemplateId, type Theme } from "../types/portfolio";

const ROOT: Record<TemplateId, string> = {
  warm: "tpl-warm",
  creative: "tpl-creative",
  dark: "tpl-dark",
};

const FONT: Record<TemplateId, string> = {
  warm: "font-elegant",
  creative: "font-display",
  dark: "",
};

export default function ProjectPage({ mode }: { mode: "public" | "preview" }) {
  const { slug, index } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [ownerName, setOwnerName] = useState("");
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [status, setStatus] = useState<"loading" | "notfound" | "ready">("loading");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [index]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(mode === "public" ? `/public/${slug}` : "/portfolio/me");
        const portfolio: PortfolioData | null = res.data.portfolio
          ? { ...emptyPortfolio, ...res.data.portfolio }
          : null;
        const found = portfolio?.projects[Number(index)];

        if (!portfolio || !found) {
          setStatus("notfound");
          return;
        }

        const saved = res.data.theme ?? {};
        setTheme({
          ...defaultTheme,
          ...saved,
          template: (TEMPLATE_IDS as readonly string[]).includes(saved.template)
            ? saved.template
            : defaultTheme.template,
        });
        setProject(found);
        setOwnerName(portfolio.personal.name);
        setStatus("ready");
      } catch {
        setStatus("notfound");
      }
    };
    load();
  }, [mode, slug, index]);

  if (status === "loading") return <p className="p-8 text-slate-600">Loading...</p>;

  if (status === "notfound" || !project)
    return (
      <div className="p-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Project not found</h1>
      </div>
    );

  const number = String(Number(index) + 1).padStart(2, "0");

  return (
    <div
      className={`portfolio-theme min-h-screen ${theme.template === "dark" ? "portfolio-dark" : ""}`}
      style={{ "--accent": theme.accent } as CSSProperties}
    >
      <div className={ROOT[theme.template]}>
        <main className="relative mx-auto max-w-4xl px-6 py-10 sm:py-14">

          <div className="proj-img mx-auto max-w-xl overflow-hidden rounded-2xl border shadow-md">
            {project.image ? (
              <img
                src={project.image}
                alt={project.name}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div
                className="flex aspect-[16/6] items-end p-8"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--accent) 40%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))",
                }}
              >
                <span
                  style={{ color: "var(--accent)" }}
                  className="text-7xl font-bold opacity-70"
                >
                  {number}
                </span>
              </div>
            )}
          </div>

          <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Project {number}
            {ownerName && ` · by ${ownerName}`}
          </p>
          <h1 className={`${FONT[theme.template]} mt-2 break-words text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl`}>
            {project.name}
          </h1>

          {project.description && (
            <>
              <h2 className="mt-10 text-xl font-semibold text-slate-900">About this project</h2>
              <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-slate-700">
                {project.description}
              </p>
            </>
          )}

          {project.tech.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-semibold text-slate-900">Technologies</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}

          {(project.live || project.github) && (
            <div className="mt-10 flex flex-wrap gap-20">
              {project.live && (
                <a
                  href={toHref(project.live)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: "var(--accent)" }}
                  className="relative z-10 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                >
                  View demo ↗
                </a>
              )}
              {project.github && (
                <a
                  href={toHref(project.github)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
                  }}
                  className="relative z-10 rounded-full border-2 px-7 py-3 text-sm font-semibold text-slate-900 hover:opacity-70"
                >
                  View code ↗
                </a>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}