import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/portfolio/me");
        setHasPortfolio(Boolean(res.data.portfolio));
        setSlug(res.data.slug ?? "");
        setIsPublished(res.data.isPublished);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updatePublish = async (publish: boolean) => {
    setMessage(null);
    setSaving(true);
    try {
      const res = await api.patch("/portfolio/publish", { slug, isPublished: publish });
      setSlug(res.data.slug);
      setIsPublished(res.data.isPublished);
      setMessage({
        type: "success",
        text: publish ? "Your portfolio is live" : "Your portfolio is now private",
      });
    } catch (err) {
      const text = axios.isAxiosError(err)
        ? err.response?.data?.message || "Something went wrong"
        : "Something went wrong";
      setMessage({ type: "error", text });
    } finally {
      setSaving(false);
    }
  };

  const publicUrl = `${window.location.origin}/u/${slug}`;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name}</h1>
      <p className="mt-2 text-slate-600">
        Upload your resume to generate your portfolio, or edit one you already made.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Create from resume</h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload a PDF or DOCX resume and we'll build your portfolio from it.
          </p>
          <Link
            to="/upload"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Upload resume
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Your portfolio</h2>

          {loading ? (
            <p className="mt-2 text-sm text-slate-500">Loading...</p>
          ) : !hasPortfolio ? (
            <p className="mt-2 text-sm text-slate-600">
              You haven't saved a portfolio yet. Fill in the editor to get started.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              <label className="block text-sm font-medium text-slate-700">Your link</label>
              <div className="flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <span className="text-slate-500">{window.location.origin}/u/</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="your-name"
                  className="min-w-0 flex-1 outline-none"
                />
              </div>

              {message && (
                <p
                  className={`rounded-lg px-3 py-2 text-sm ${message.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                    }`}
                >
                  {message.text}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => updatePublish(true)}
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {isPublished ? "Update link" : "Publish"}
                </button>
                {isPublished && (
                  <>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </a>
                    <button
                      onClick={() => updatePublish(false)}
                      disabled={saving}
                      className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Unpublish
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <Link
            to="/preview"
            className="mt-6 inline-block text-sm font-semibold text-indigo-600 hover:underline"
          >
            Open editor
          </Link>
        </div>
      </div>
    </main>
  );
}