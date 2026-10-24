import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { defaultTheme, type PortfolioData, type Theme } from "../types/portfolio";
import PortfolioView from "../components/PortfolioView";

export default function PublicPortfolio() {
  const { slug } = useParams();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [status, setStatus] = useState<"loading" | "notfound" | "ready">("loading");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/public/${slug}`);
        setData(res.data.portfolio);
        setPhotoUrl(res.data.photoUrl ?? "");
        setTheme({ ...defaultTheme, ...res.data.theme });
        setStatus("ready");
      } catch {
        setStatus("notfound");
      }
    };
    load();
  }, [slug]);

  if (status === "loading") return <p className="p-8 text-slate-600">Loading...</p>;
  if (status === "notfound" || !data)
    return (
      <div className="p-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Portfolio not found</h1>
        <p className="mt-2 text-slate-600">This link doesn't exist or isn't published.</p>
      </div>
    );

  return (
    <PortfolioView data={data} photoUrl={photoUrl} theme={theme} projectHref={(i) => `/u/${slug}/project/${i}`} />
  );
}