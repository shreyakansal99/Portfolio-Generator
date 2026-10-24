import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import api from "../api/axios";
import PortfolioView from "../components/PortfolioView";
import { defaultTheme, emptyPortfolio, TEMPLATE_IDS, TEMPLATE_LABELS, type PortfolioData, type Theme } from "../types/portfolio";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);

const ACCENTS = ["#4f46e5", "#0ea5e9", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#0f766e"];

export default function Preview() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showMessage = (type: "success" | "error", text: string) => {
    window.clearTimeout(timer.current);
    setMessage({ type, text });
    timer.current = window.setTimeout(() => setMessage(null), 3500);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/portfolio/me");
        setPhotoUrl(res.data.photoUrl ?? "");

        // Older portfolios may have a template name that no longer exists
        const saved = res.data.theme ?? {};
        setTheme({
          ...defaultTheme,
          ...saved,
          template: (TEMPLATE_IDS as readonly string[]).includes(saved.template)
            ? saved.template
            : defaultTheme.template,
        });

        if (res.data.portfolio) {
          const portfolio: PortfolioData = { ...emptyPortfolio, ...res.data.portfolio };
          setData(portfolio);
          setSlug(res.data.slug ?? slugify(portfolio.personal.name));
          setIsPublished(res.data.isPublished);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const publish = async () => {
    const wasPublished = isPublished;
    setSaving(true);
    try {
      const res = await api.patch("/portfolio/publish", { slug, isPublished: true });
      setSlug(res.data.slug);
      setIsPublished(true);
      showMessage("success", wasPublished ? "Link updated" : "Your portfolio is live");
    } catch (err) {
      showMessage(
        "error",
        isAxiosError(err)
          ? err.response?.data?.message || "Something went wrong"
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateTheme = async (next: Theme) => {
    setTheme(next);
    try {
      await api.patch("/portfolio/theme", next);
    } catch {
      showMessage("error", "Could not save your theme");
    }
  };

  if (loading) return <p className="p-8 text-slate-600">Loading your portfolio...</p>;

  if (!data)
    return (
      <div className="p-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No portfolio yet</h1>
        <p className="mt-2 text-slate-600">Upload your resume to create one.</p>
        <Link
          to="/upload"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Upload resume
        </Link>
      </div>
    );

  return (
    <div className="md:flex">
      {sidebarOpen && (
        <div className="relative md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:self-start">
          <aside className="h-full overflow-y-auto border-b border-slate-200 bg-white px-4 py-5 md:border-b-0 md:border-r">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Template
            </p>
            <div className="mt-3 flex flex-wrap gap-2 md:flex-col">
              {TEMPLATE_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => updateTheme({ ...theme, template: id })}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-medium ${theme.template === id
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  {TEMPLATE_LABELS[id]}
                </button>
              ))}
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Color
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Use color ${c}`}
                  onClick={() => updateTheme({ ...theme, accent: c })}
                  style={{ backgroundColor: c }}
                  className={`h-8 w-8 rounded-full ${theme.accent === c ? "ring-2 ring-slate-900 ring-offset-2" : ""
                    }`}
                />
              ))}
            </div>
          </aside>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Hide design panel"
            className="absolute right-0 top-1/2 z-40 hidden h-14 w-9 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-slate-200 hover:bg-slate-50 md:flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      )}

      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Show design panel"
          className="fixed left-0 top-1/2 z-40 hidden h-14 w-8 -translate-y-1/2 items-center justify-center rounded-r-full bg-white text-slate-900 shadow-lg ring-1 ring-slate-200 hover:bg-slate-50 md:flex"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label={sidebarOpen ? "Hide design panel" : "Show design panel"}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:hidden"
            >
              {sidebarOpen ? "Hide design" : "Design"}
            </button>

            <Link
              to="/editor"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit
            </Link>

            <div className="flex min-w-0 flex-1 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <span className="text-slate-500">{window.location.origin}/u/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="your-name"
                className="min-w-0 flex-1 outline-none"
              />
            </div>

            <button
              onClick={publish}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {isPublished ? "Update link" : "Publish"}
            </button>

            {isPublished && (
              <a
                href={`${window.location.origin}/u/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                View live
              </a>
            )}
          </div>
          {message && (
            <div
              role="status"
              className={`fixed right-6 top-6 z-[60] flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${message.type === "success" ? "bg-green-600" : "bg-red-600"
                }`}
            >
              <span aria-hidden="true">{message.type === "success" ? "✓" : "!"}</span>
              <span>{message.text}</span>
              <button
                type="button"
                onClick={() => setMessage(null)}
                aria-label="Dismiss"
                className="ml-2 text-lg leading-none text-white/80 hover:text-white"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <PortfolioView data={data} photoUrl={photoUrl} theme={theme} />
      </div>
    </div>
  );
}