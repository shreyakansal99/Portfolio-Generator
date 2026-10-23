import { type ReactNode } from "react";
import { GitHubIcon, GlobeIcon, LinkedInIcon, MailIcon, MapPinIcon, PhoneIcon } from "../Icons";
import {
  CertificationList,
  EducationList,
  ExperienceList,
  toHref,
  formatCount,
  type TemplateProps,
} from "./parts";

const TINTS = ["#f9a98b", "#fbd46d", "#9fd3c7"];

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-3xl font-bold c-ink">
      {children} <span style={{ color: "var(--peach)" }}>✦</span>
    </h2>
  );
}

export default function CreativeTemplate({ data, photoUrl }: TemplateProps) {
  const { personal, experience, education, projects, skills, certifications } = data;

  const stats = [
    { kind: "projects", n: projects.length, label: "Projects" },
    { kind: "skills", n: skills.length, label: "Skills" },
    {
      kind: "experience",
      n: experience.length,
      label: experience.length === 1 ? "Role" : "Roles",
    },
    { kind: "certificates", n: certifications.length, label: "Certifications" },
  ].filter((s) => s.n > 0);

  const socials = [
    { label: "LinkedIn", url: personal.linkedin, icon: <LinkedInIcon /> },
    { label: "GitHub", url: personal.github, icon: <GitHubIcon /> },
    { label: "Website", url: personal.website, icon: <GlobeIcon /> },
  ].filter((s) => s.url);

  const topSocials = socials.filter((s) => s.label === "LinkedIn" || s.label === "GitHub");

  return (
    <div className="tpl-creative">
      {/* Decorative shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full"
        style={{ backgroundColor: "var(--panel)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-[48%] h-56 w-56 rounded-full opacity-50"
        style={{ backgroundColor: "var(--peach)" }}
      />

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-4 pt-12 sm:pt-16">
        {/* Hero */}
        <header className={`grid items-center gap-14 ${photoUrl ? "md:grid-cols-2" : ""}`}>
          <div>
            <p className="font-display text-3xl font-semibold c-ink">Hello, I’m</p>
            <h1 className="font-display break-words text-6xl font-bold leading-[1.05] c-ink sm:text-7xl">
              {personal.name}
            </h1>
            {personal.title && (
              <p className="font-script mt-3 text-3xl" style={{ color: "var(--peach-ink)" }}>
                {personal.title}
              </p>
            )}
            {personal.summary && (
              <p className="mt-5 max-w-md leading-relaxed text-slate-700">
                {personal.summary}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {projects.length > 0 && (
                <a
                  href="#projects"
                  style={{ backgroundColor: "var(--panel)" }}
                  className="rounded-full px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  View Work ↗
                </a>
              )}
              <div className="ml-3 flex items-center gap-3">
                {topSocials.map((s) => (
                  <a
                    key={s.label}
                    href={toHref(s.url)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    style={{ borderColor: "var(--panel)", color: "var(--panel)" }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 hover:opacity-70"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {photoUrl && (
            <div className="relative mx-auto h-[26rem] w-72 sm:h-[30rem] sm:w-80">
              <div
                className="absolute inset-0 -translate-y-4 translate-x-4 rounded-b-[2rem] rounded-t-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 25%, white)" }}
              />
              <img
                src={photoUrl}
                alt={personal.name}
                style={{ borderColor: "var(--accent)" }}
                className="absolute inset-0 h-full w-full rounded-b-[2rem] rounded-t-full border-4 object-cover"
              />
              {personal.location && (
                <div
                  className="absolute -bottom-5 -left-4 rounded-2xl px-5 py-3 text-white shadow-lg sm:-left-10"
                  style={{ backgroundColor: "var(--panel)" }}
                >
                  <p className="text-xs uppercase tracking-widest text-white/70">Based in</p>
                  <p className="font-script text-2xl">{personal.location}</p>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Selected works */}
        {projects.length > 0 && (
          <section
            id="projects"
            className="mt-24 scroll-mt-24 rounded-[2rem] p-6 text-white sm:p-10"
            style={{ backgroundColor: "var(--panel)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-3xl font-bold">
                Selected Works <span style={{ color: "var(--peach)" }}>✦</span>
              </h2>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <article
                  key={`${p.name}-${i}`}
                  className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-transparent transition duration-300 hover:z-10 hover:scale-[1.03] hover:border-[color:var(--accent)] hover:shadow-xl"
                  style={{ backgroundColor: "#fff4ec", color: "var(--panel)" }}
                >
                  <div
                    className="relative flex h-36 items-end overflow-hidden p-5"
                    style={{ backgroundColor: TINTS[i % TINTS.length] }}
                  >
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    {!p.image && (
                      <span className="font-display text-5xl font-bold opacity-40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                    {p.tech[0] && (
                      <span
                        className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: "#fffaf6", color: "var(--panel)" }}
                      >
                        {p.tech[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold">{p.name}</h3>
                    <div className="mt-1 h-[3.75rem]">
                      {p.description && (
                        <p className="line-clamp-3 text-sm opacity-75">{p.description}</p>
                      )}
                    </div>
                    {p.tech.length > 1 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.tech.slice(1).map((t) => (
                          <span
                            key={t}
                            className="rounded-full px-2.5 py-0.5 text-xs"
                            style={{
                              backgroundColor: "color-mix(in srgb, var(--panel) 12%, transparent)",
                            }}
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
                            className="rounded-full border px-3 py-1 text-xs font-semibold hover:opacity-70"
                            style={{
                              borderColor: "color-mix(in srgb, var(--panel) 35%, transparent)",
                            }}
                          >
                            Demo
                          </a>
                        )}
                        {p.github && (
                          <a
                            href={toHref(p.github)}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto rounded-full border px-3 py-1 text-xs font-semibold hover:opacity-70"
                            style={{
                              borderColor: "color-mix(in srgb, var(--panel) 35%, transparent)",
                            }}
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

        {/* About and skills */}
        {skills.length > 0 && (
          <section id="skills" className="mt-20 scroll-mt-24">
            <Heading>What I do</Heading>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {skills.map((s) => (
                <div key={s} className="group flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: "var(--panel)" }}
                  >
                    {s.charAt(0).toUpperCase()}
                  </span>
                  <span className="inline-block min-w-0 origin-left font-medium text-slate-900 transition-transform duration-200 [overflow-wrap:anywhere] group-hover:scale-110">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stats band */}
        {stats.length > 0 && (
          <section
            className="mt-20 rounded-[2rem] border-2 px-6 py-8 sm:px-10"
            style={{
              backgroundColor: "var(--sun)",
              color: "var(--panel)",
              borderColor: "color-mix(in srgb, var(--panel) 35%, transparent)",
            }}
          >
            <div className="stat-divide flex flex-wrap gap-y-8 md:flex-nowrap">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="group flex-1 basis-1/2 px-4 text-center md:basis-0"
                >
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    <p className="font-display text-4xl font-bold">
                      {formatCount(s.kind, s.n)}
                    </p>
                    <p className="mt-1 text-sm font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="c-card hl mt-20 rounded-[2rem] p-6 shadow-sm sm:p-8">
            <Heading>Experience</Heading>
            <div className="mt-6 space-y-6">
              <ExperienceList items={experience} />
            </div>
          </section>
        )}

        {/* Education and certifications */}
        {(education.length > 0 || certifications.length > 0) && (
          <div
            className={`mt-8 grid gap-8 ${education.length > 0 && certifications.length > 0 ? "md:grid-cols-2" : ""
              }`}
          >
            {education.length > 0 && (
              <section className="c-card hl rounded-[2rem] p-6 shadow-sm sm:p-8">
                <Heading>Education</Heading>
                <div className="mt-6 space-y-6">
                  <EducationList items={education} />
                </div>
              </section>
            )}
            {certifications.length > 0 && (
              <section className="c-card h1 rounded-[2rem] p-6 shadow-sm sm:p-8">
                <Heading>Certifications</Heading>
                <div className="mt-6 space-y-4">
                  <CertificationList items={certifications} />
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 mt-24 px-6 py-14 text-white"
        style={{ backgroundColor: "var(--panel)" }}
      >
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
          <h2 className="font-display text-3xl font-bold leading-snug">
            Let’s create something{" "}
            <span
              className="font-script text-4xl font-semibold"
              style={{ color: "var(--peach)" }}
            >
              amazing!
            </span>
          </h2>

          <div>
            <p className="font-semibold">Get in touch</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/90 [overflow-wrap:anywhere]">
              {personal.email && (
                <a href={`mailto:${personal.email}`} className="icon-link inline-flex items-center gap-3">
                  <span className="icon-hl-c flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 text-white">
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
                  <span className="icon-hl-c flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 text-white">
                    <PhoneIcon />
                  </span>
                  {personal.phone}
                </a>
              )}
              {personal.location && (
                <span className="inline-flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 text-white">
                    <MapPinIcon />
                  </span>
                  {personal.location}
                </span>
              )}
            </div>
          </div>

          {socials.length > 0 && (
            <div>
              <p className="font-semibold">Follow along</p>
              <div className="mt-4 flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={toHref(s.url)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="icon-hl-c flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}