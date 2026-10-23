import type { ReactNode } from "react";
import {
  AwardIcon,
  BriefcaseIcon,
  FolderIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "../Icons";
import {
  CertificationList,
  EducationList,
  ExperienceList,
  SkillChips,
  toHref,
  formatCount,
  type TemplateProps,
} from "./parts";

function Card({
  id,
  eyebrow,
  title,
  highlight = false,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  highlight?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`warm-card ${highlight ? "hl" : ""} mt-8 scroll-mt-24 rounded-3xl p-6 shadow-sm sm:p-8`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{eyebrow}</p>
      <h2 className="font-elegant mt-1 text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

export default function WarmTemplate({ data, photoUrl }: TemplateProps) {
  const { personal, experience, education, projects, skills, certifications } = data;

  const initials = personal.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  const navItems = [
    experience.length > 0 && { label: "Experience", href: "#experience" },
    projects.length > 0 && { label: "Projects", href: "#projects" },
    skills.length > 0 && { label: "Skills", href: "#skills" },
    certifications.length > 0 && { label: "Certificates", href: "#certificates" },
  ].filter(Boolean) as { label: string; href: string }[];

  const blocks = [
    {
      kind: "experience",
      count: experience.length,
      label: "Experience",
      href: "#experience",
      icon: <BriefcaseIcon />,
    },
    { kind: "projects", count: projects.length, label: "Projects", href: "#projects", icon: <FolderIcon /> },
    { kind: "skills", count: skills.length, label: "Skills", href: "#skills", icon: <StarIcon /> },
    {
      kind: "certificates",
      count: certifications.length,
      label: "Certificates",
      href: "#certificates",
      icon: <AwardIcon />,
    },
  ].filter((b) => b.count > 0);

  const socials = [
    { label: "LinkedIn", url: personal.linkedin, icon: <LinkedInIcon /> },
    { label: "GitHub", url: personal.github, icon: <GitHubIcon /> },
    { label: "Website", url: personal.website, icon: <GlobeIcon /> },
  ].filter((s) => s.url);

  const topSocials = socials.filter((s) => s.label === "LinkedIn" || s.label === "GitHub");

  return (
    <div className="tpl-warm">
      <main className="mx-auto max-w-5xl px-6 pb-12 pt-6 sm:pb-16">
        {/* Top bar: initials logo, section links, talk button */}
        <nav className="flex items-center justify-between gap-4">
          <span className="font-display text-3xl font-bold text-indigo-600">
            {initials}.
          </span>

          {navItems.length > 0 && (
            <div className="hidden items-center gap-8 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs font-medium uppercase tracking-widest text-slate-800 hover:text-indigo-600"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {topSocials.map((s) => (
              <a
                key={s.label}
                href={toHref(s.url)}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:text-indigo-600"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <header
          className={`mt-14 grid items-center gap-14 ${photoUrl ? "md:grid-cols-[1.2fr_1fr]" : ""
            }`}
        >
          <div>
            <p className="inline-block border-b border-slate-400/60 pb-1 text-xs font-medium uppercase tracking-[0.3em] text-slate-700">
              Hi, I’m
            </p>

            <h1 className="font-display mt-6 break-words text-4xl font-semibold uppercase leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {personal.title && (
                <span className="block text-indigo-600">{personal.title}</span>
              )}
              <span className="block text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
                {personal.name}
              </span>
            </h1>

            {personal.summary && (
              <p className="mt-6 max-w-md leading-relaxed text-slate-600">{personal.summary}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-6">
              {projects.length > 0 && (
                <a
                  href="#projects"
                  style={{ backgroundColor: "var(--accent)" }}
                  className="rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm hover:opacity-90"
                >
                  View projects →
                </a>
              )}
            </div>
          </div>

          {photoUrl && (
            <div className="relative mx-auto w-72 sm:w-80 lg:w-96">
              <div
                aria-hidden="true"
                className="absolute -right-6 top-10 h-full w-full rounded-[3rem]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--accent) 25%, white)",
                }}
              />
              <img
                src={photoUrl}
                alt={personal.name}
                style={{ borderColor: "var(--accent)" }}
                className="relative aspect-[4/5] w-full rounded-[3rem] border-4 object-cover shadow-xl"
              />

              <span aria-hidden="true" className="absolute -left-6 top-8 text-2xl text-indigo-600">
                ✦
              </span>
              <span aria-hidden="true" className="absolute -left-2 top-24 text-lg text-indigo-600">
                ✦
              </span>

              {personal.location && (
                <div className="warm-card absolute -bottom-8 -right-2 rounded-2xl px-5 py-3 text-right shadow-lg sm:-right-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Based in</p>
                  <p className="font-elegant text-lg font-semibold uppercase text-indigo-600">
                    {personal.location}
                  </p>
                  <span className="inline-block text-indigo-600">
                    <MapPinIcon />
                  </span>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Blocks: only the ones that have data */}
        {blocks.length > 0 && (
          <section className="warm-card relative z-10 mt-20 rounded-3xl p-6 shadow-lg sm:p-8">
            <div className="flex flex-wrap gap-y-8 md:flex-nowrap md:divide-x md:divide-slate-200">
              {blocks.map((b) => (
                <a
                  key={b.label}
                  href={b.href}
                  className="flex flex-1 basis-1/2 flex-col items-center gap-2 px-4 text-center hover:opacity-80 md:basis-0"
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full text-indigo-600 [&_svg]:h-5 [&_svg]:w-5"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)",
                    }}
                  >
                    {b.icon}
                  </span>
                  <span className="font-elegant text-4xl font-semibold text-slate-900">
                    {formatCount(b.kind, b.count)}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-widest text-slate-600">
                    {b.label}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <Card id="experience" eyebrow="Experience" title="Where I’ve worked" highlight>
            <ExperienceList items={experience} />
          </Card>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section id="projects" className="mt-16 scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Selected work
            </p>
            <h2 className="font-elegant mt-1 text-3xl font-semibold text-slate-900">Projects</h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <article
                  key={i}
                  className="warm-card hl relative flex flex-col overflow-hidden rounded-3xl shadow-sm hover:z-10 hover:scale-[1.03]"
                >
                  <div
                    className="relative flex h-36 items-end p-5"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--accent) 40%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))",
                    }}
                  >
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    {!p.image && (
                      <span
                        style={{ color: "var(--accent)" }}
                        className="font-elegant text-5xl font-bold opacity-70"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                    {p.tech[0] && (
                      <span className="warm-card absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-slate-700">
                        {p.tech[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold text-slate-900">{p.name}</h3>
                    <div className="mt-1 h-[3.75rem]">
                      {p.description && (
                        <p className="line-clamp-3 text-sm text-slate-600">{p.description}</p>
                      )}
                    </div>
                    {p.tech.length > 1 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.tech.slice(1).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {(p.live || p.github) && (
                      <div className="mt-auto flex items-center justify-between pt-4">
                        {p.live && (
                          <a
                            href={toHref(p.live)}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-900 hover:opacity-70"
                          >
                            Demo 
                          </a>
                        )}
                        {p.github && (
                          <a
                            href={toHref(p.github)}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-900 hover:opacity-70"
                          >
                            Code 
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(skills.length > 0 || education.length > 0) && (
          <div className="grid gap-6 md:grid-cols-2">
            {skills.length > 0 && (
              <Card id="skills" eyebrow="Skills" title="What I work with" highlight>
                <SkillChips skills={skills} />
              </Card>
            )}
            {education.length > 0 && (
              <Card eyebrow="Education" title="Where I studied" highlight>
                <EducationList items={education} />
              </Card>
            )}
          </div>
        )}

        {certifications.length > 0 && (
          <Card id="certificates" eyebrow="Certificates" title="Credentials">
            <CertificationList items={certifications} />
          </Card>
        )}

        {/* Footer */}
        <footer className="mt-20 flex flex-col gap-8 border-t border-slate-200 pt-10 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-2xl font-semibold text-slate-900 md:max-w-xs">
            Let’s create something amazing together.
          </h2>

          <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="icon-link inline-flex items-center gap-3">
                <span className="icon-hl flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-indigo-600">
                  <MailIcon />
                </span>
                {personal.email}
              </a>
            )}
            {personal.phone && (
              <a
                href={`tel:${personal.phone.replace(/\s+/g, "")}`}
                className="icon-link inline-flex items-center gap-3"
              >
                <span className="icon-hl flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-indigo-600">
                  <PhoneIcon />
                </span>
                {personal.phone}
              </a>
            )}
          </div>

          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={toHref(s.url)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="icon-hl flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}