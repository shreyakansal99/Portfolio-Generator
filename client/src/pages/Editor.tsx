import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import PersonalForm from "../components/editor/PersonalForm";
import ExperienceForm from "../components/editor/ExperienceForm";
import EducationForm from "../components/editor/EducationForm";
import ProjectsForm from "../components/editor/ProjectsForm";
import SkillsForm from "../components/editor/SkillsForm";
import CertificationsForm from "../components/editor/CertificationsForm";
import { emptyPortfolio, type PortfolioData } from "../types/portfolio";
import { useLocation, Link } from "react-router-dom";
import PhotoUpload from "../components/editor/PhotoUpload";

const TABS = ["Personal", "Experience", "Education", "Projects", "Skills", "Certifications"] as const;
type Tab = (typeof TABS)[number];

export default function Editor() {
  const [data, setData] = useState<PortfolioData>(emptyPortfolio);
  const [activeTab, setActiveTab] = useState<Tab>("Personal");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      try {
        const fromResume = location.state?.portfolio;
        if (fromResume) {
          setData({ ...emptyPortfolio, ...fromResume });
          setNotice({
            type: "success",
            text: "We filled this in from your resume. Check each tab, then click Save on each one.",
          });
          return;
        }
        const res = await api.get("/portfolio/me");
        setPhotoUrl(res.data.photoUrl ?? "");
        if (res.data.portfolio) {
          setData({ ...emptyPortfolio, ...res.data.portfolio });
        }
      } catch (err) {
        console.error(err);
        setNotice({ type: "error", text: "Could not load your portfolio" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const timer = useRef<number | undefined>(undefined);

  const showNotice = (type: "success" | "error", text: string) => {
    window.clearTimeout(timer.current);
    setNotice({ type, text });
    timer.current = window.setTimeout(() => setNotice(null), 3500);
  };

  const save = async <K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) => {
    const next = { ...data, [key]: value };
    try {
      const res = await api.put("/portfolio/me", next);
      setData({ ...emptyPortfolio, ...res.data.portfolio });
      showNotice("success", `${activeTab} changes saved`);
    } catch (err) {
      console.error(err);
      showNotice("error", "Could not save. Please try again.");
    }
  };

  if (loading) {
    return <p className="p-8 text-slate-600">Loading your portfolio...</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link to="/preview" className="text-sm font-semibold text-indigo-600 hover:underline">
        ← Back to portfolio
      </Link>
      <h1 className="text-3xl font-bold text-slate-900">Edit your portfolio</h1>
      <p className="mt-2 text-slate-600">
        Review the details and fix anything that isn't right.
      </p>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${activeTab === tab
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === "Personal" && (
          <PhotoUpload photoUrl={photoUrl} onChange={setPhotoUrl} />
        )}
        {activeTab === "Personal" && (
          <PersonalForm
            defaultValues={data.personal}
            onSave={(v) => save("personal", v)}
          />
        )}
        {activeTab === "Experience" && (
          <ExperienceForm
            defaultValues={data.experience}
            onSave={(v) => save("experience", v)}
          />
        )}
        {activeTab === "Education" && (
          <EducationForm
            defaultValues={data.education}
            onSave={(v) => save("education", v)}
          />
        )}
        {activeTab === "Projects" && (
          <ProjectsForm
            defaultValues={data.projects}
            onSave={(v) => save("projects", v)}
          />
        )}
        {activeTab === "Skills" && (
          <SkillsForm defaultValues={data.skills} onSave={(v) => save("skills", v)} />
        )}
        {activeTab === "Certifications" && (
          <CertificationsForm
            defaultValues={data.certifications}
            onSave={(v) => save("certifications", v)}
          />
        )}
      </div>
      {notice && (
        <div
          role="status"
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${notice.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
        >
          <span aria-hidden="true">{notice.type === "success" ? "✓" : "!"}</span>
          <span>{notice.text}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
            className="ml-2 text-lg leading-none text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}