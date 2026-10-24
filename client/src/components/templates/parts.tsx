import type { ReactNode } from "react";
import type { Certification, Education, Experience, PortfolioData, Project } from "../../types/portfolio";
import { GitHubIcon, GlobeIcon, LinkedInIcon, MailIcon, MapPinIcon, PhoneIcon } from "../Icons";

export interface TemplateProps {
  data: PortfolioData;
  photoUrl?: string;
}

// Adds https:// when missing, so a link can never start with something like "javascript:"
export const toHref = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const COUNT_CAPS: Record<string, number> = {
  experience: 5,
  projects: 5,
  certificates: 5,
  skills: 15,
};

// Shows "5+" instead of the real number once it goes past the limit
export const formatCount = (kind: string, n: number) => {
  const cap = COUNT_CAPS[kind];
  return cap !== undefined && n > cap ? `${cap}+` : String(n);
};

type Variant = "default" | "compact" | "card";

const WRAP: Record<Variant, string> = {
  default: "mt-14",
  compact: "mt-8",
  card: "mt-8 rounded-2xl border border-slate-200 p-6",
};

const HEADING: Record<Variant, string> = {
  default: "text-xl",
  compact: "text-xs uppercase tracking-wider",
  card: "text-lg",
};

const BODY: Record<Variant, string> = {
  default: "mt-6 space-y-6",
  compact: "mt-3 space-y-3",
  card: "mt-5 space-y-5",
};

export function Section({ title, children, variant = "default" }: { title: string; children: ReactNode; variant?: Variant; }) {
  return (
    <section className={WRAP[variant]}>
      <h2 className={`border-b border-slate-200 pb-2 font-bold text-slate-900 ${HEADING[variant]}`}>
        {title}
      </h2>
      <div className={BODY[variant]}>{children}</div>
    </section>
  );
}

export function ContactItems({ personal, iconClass = "text-indigo-600", linkClass = "hover:text-indigo-600" }: {
  personal: PortfolioData["personal"]; iconClass?: string; linkClass?: string; }) {
  const links = [
    { label: "LinkedIn", url: personal.linkedin, icon: <LinkedInIcon /> },
    { label: "GitHub", url: personal.github, icon: <GitHubIcon /> },
    { label: "Website", url: personal.website, icon: <GlobeIcon /> },
  ].filter((l) => l.url);

  return (
    <>
      {personal.location && (
        <span className="inline-flex items-center gap-2">
          <span className={iconClass}><MapPinIcon /></span>
          {personal.location}
        </span>
      )}
      {personal.email && (
        <a href={`mailto:${personal.email}`} className={`inline-flex items-center gap-2 ${linkClass}`}>
          <span className={iconClass}><MailIcon /></span>
          {personal.email}
        </a>
      )}
      {personal.phone && (
        <a
          href={`tel:${personal.phone.replace(/\s+/g, "")}`}
          className={`inline-flex items-center gap-2 ${linkClass}`}
        >
          <span className={iconClass}><PhoneIcon /></span>
          {personal.phone}
        </a>
      )}
      {links.map((l) => (
        <a
          key={l.label}
          href={toHref(l.url)}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-2 ${linkClass}`}
        >
          <span className={iconClass}>{l.icon}</span>
          {l.label}
        </a>
      ))}
    </>
  );
}

export function AboutText({ summary }: { summary: string }) {
  return <p className="whitespace-pre-line leading-relaxed text-slate-700">{summary}</p>;
}

export function ExperienceList({ items }: { items: Experience[] }) {
  return (
    <>
      {items.map((e, i) => (
        <div key={i}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-semibold text-slate-900">
              {e.role} · {e.company}
            </h3>
            <span className="text-sm text-slate-500">
              {e.start}
              {(e.start || e.end) && " - "}
              {e.end}
            </span>
          </div>
          {e.location && <p className="text-sm text-slate-500">{e.location}</p>}
          {e.highlights.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              {e.highlights.map((h, j) => (
                <li key={j}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

export function ProjectsGrid({ items }: { items: Project[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((p, i) => (
        <div key={i} className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900">{p.name}</h3>
          {p.description && <p className="mt-1 text-sm text-slate-600">{p.description}</p>}
          {p.tech.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-700"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3 flex gap-4 text-sm font-medium">
            {p.github && (
              <a href={toHref(p.github)} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                Code
              </a>
            )}
            {p.live && (
              <a href={toHref(p.live)} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                Live
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkillChips({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s}
          className="cursor-default rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 transition-transform duration-200 hover:scale-110"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export function EducationList({ items }: { items: Education[] }) {
  return (
    <>
      {items.map((e, i) => (
        <div key={i}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-semibold text-slate-900">{e.institution}</h3>
            <span className="text-sm text-slate-500">
              {e.start}
              {(e.start || e.end) && " - "}
              {e.end}
            </span>
          </div>
          <p className="text-slate-700">
            {[e.degree, e.field].filter(Boolean).join(", ")}
            {e.grade && ` · ${e.grade}`}
          </p>
        </div>
      ))}
    </>
  );
}

export function CertificationList({ items }: { items: Certification[] }) {
  return (
    <>
      {items.map((c, i) => (
        <p key={i} className="text-slate-700">
          <span className="font-medium text-slate-900">{c.name}</span>
          {c.issuer && ` · ${c.issuer}`}
          {c.year && ` · ${c.year}`}
        </p>
      ))}
    </>
  );
}