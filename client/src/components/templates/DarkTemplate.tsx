import type { ReactNode } from "react";
import { GitHubIcon, GlobeIcon, LinkedInIcon, MailIcon, PhoneIcon } from "../Icons";
import { CertificationList, EducationList, ExperienceList, formatCount, toHref, type TemplateProps } from "./parts";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{children}</p>
  );
}

export default function DarkTemplate({ data, photoUrl }: TemplateProps) {
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

  const codeSnippet = [
    "const developer = {",
    `  name: ${JSON.stringify(personal.name)},`,
    personal.title && `  title: ${JSON.stringify(personal.title)},`,
    `  projects: ${projects.length},`,
    "};",
  ]
    .filter(Boolean)
    .join("\n");

  const topSocials = socials.filter((s) => s.label === "LinkedIn" || s.label === "GitHub");

  return (
    <div className="tpl-dark">
      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* Hero */}
        <header className={`grid items-center gap-14 ${photoUrl ? "md:grid-cols-2" : ""}`}>
          <div>
            {personal.title && (
              <span
                style={{ borderColor: "var(--accent)" }}
                className="inline-block rounded-md border bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600"
              >
                {personal.title}
              </span>
            )}
            <h1 className="mt-5 break-words text-5xl font-bold tracking-tight text-white sm:text-6xl">
              <span className="font-script text-6xl font-medium sm:text-3xl">Hi, I’m</span>{" "}
              <span className="text-indigo-600">{personal.name}</span>
            </h1>
            {personal.summary && (
              <p className="mt-5 max-w-md leading-relaxed text-slate-300">
                {personal.summary}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {projects.length > 0 && (
                <a
                  href="#projects"
                  className="d-grad mr-2 rounded-lg px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  View My Work ↗
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
                    className="ml-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-slate-200 hover:bg-white/10"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {skills.length > 0 && (
              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Technologies I work with
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.slice(0, 8).map((s) => (
                    <span
                      key={s}
                      className="d-card chip-hl cursor-default rounded-md px-3 py-1.5 text-sm text-slate-200 hover:scale-110"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {photoUrl && (
            <div className="relative mx-auto h-72 w-72 sm:h-96 sm:w-96">
              <div className="d-grad absolute inset-0 -translate-y-3 translate-x-3 rounded-full opacity-70" />
              <img
                src={photoUrl}
                alt={personal.name}
                style={{ borderColor: "var(--accent)" }}
                className="relative h-full w-full rounded-full border-4 object-cover"
              />
              <div className="d-code absolute -right-10 -top-12 hidden w-56 rounded-xl p-3 shadow-xl backdrop-blur sm:block lg:-right-14">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{"</>"} Code</span>
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                </div>
                <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-5 text-slate-300">
                  {codeSnippet}
                </pre>
              </div>
            </div>
          )}
        </header>

        {/* About */}
        {stats.length > 0 && (
          <section className="mt-24 flex flex-wrap justify-center gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="d-card group min-w-[9rem] max-w-[16rem] flex-1 rounded-xl p-4 text-center"
              >
                <div className="transition-transform duration-200 group-hover:scale-110">
                  <p style={{ color: "var(--accent-soft)" }} className="text-3xl font-bold">
                    {formatCount(s.kind, s.n)}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section id="skills" className="mt-24 scroll-mt-24">
            <div className="text-center">
              <Eyebrow>My skills</Eyebrow>
              <h2 className="mt-2 text-3xl font-bold text-white">Technologies and tools</h2>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {skills.map((s) => (
                <div
                  key={s}
                  style={{
                    borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
                    backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
                  }}
                  className="group flex min-h-[3.5rem] items-center justify-center rounded-lg border px-4 py-3 text-center text-sm font-medium text-slate-100 [overflow-wrap:anywhere]"
                >
                  <span className="inline-block transition-transform duration-200 group-hover:scale-110">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section id="projects" className="mt-24 scroll-mt-24">
            <div className="text-center">
              <Eyebrow>Featured projects</Eyebrow>
              <h2 className="mt-2 text-3xl font-bold text-white">Some of my recent work</h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <article
                  key={i}
                  className="d-card hl relative flex flex-col overflow-hidden rounded-xl hover:z-10 hover:scale-[1.03]"
                >
                  <div
                    className="relative flex h-36 items-end p-4"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--accent) 45%, #0b1020), color-mix(in srgb, var(--accent) 12%, #0b1020))",
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
                      <span className="text-4xl font-bold text-white/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                    {p.tech[0] && (
                      <span className="absolute right-3 top-3 rounded-md bg-black/40 px-2.5 py-1 text-xs text-slate-200">
                        {p.tech[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-elegant text-xl font-semibold text-white">{p.name}</h3>
                    <div className="mt-1 h-[3.75rem]">
                      {p.description && (
                        <p className="line-clamp-3 text-sm text-slate-400">{p.description}</p>
                      )}
                    </div>
                    {p.tech.length > 1 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.tech.slice(1).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {(p.live || p.github) && (
                      <div className="mt-auto flex items-center justify-between pt-4 text-sm font-semibold">
                        {p.live && (
                          <a
                            href={toHref(p.live)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            Demo
                          </a>
                        )}
                        {p.github && (
                          <a
                            href={toHref(p.github)}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto text-indigo-600 hover:underline"
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

        {/* Experience */}
        {experience.length > 0 && (
          <section className="d-card hl mt-24 rounded-2xl p-6 sm:p-8">
            <div className="text-center">
              <Eyebrow>Experience</Eyebrow>
              <h2 className="mt-2 text-3xl font-bold text-white">Where I’ve worked</h2>
            </div>
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
              <section className="d-card hl rounded-2xl p-6 sm:p-8">
                <div className="text-center">
                  <Eyebrow>Education</Eyebrow>
                  <h2 className="mt-2 text-2xl font-bold text-white">Where I studied</h2>
                </div>
                <div className="mt-6 space-y-6">
                  <EducationList items={education} />
                </div>
              </section>
            )}
            {certifications.length > 0 && (
              <section className="d-card rounded-2xl p-6 sm:p-8">
                <div className="text-center">
                  <Eyebrow>Certifications</Eyebrow>
                  <h2 className="mt-2 text-2xl font-bold text-white">Credentials</h2>
                </div>
                <div className="mt-6 space-y-4">
                  <CertificationList items={certifications} />
                </div>
              </section>
            )}
          </div>
        )}

        {/* Contact */}
        <section className="d-card mt-24 rounded-2xl p-8 sm:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <Eyebrow>Let’s work together</Eyebrow>
              <h2 className="mt-2 text-3xl font-bold text-white">Have a project in mind?</h2>
              <p className="mt-3 max-w-sm text-slate-400">
                Feel free to reach out using any of the links here.
              </p>
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="d-grad mt-6 inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Get In Touch ↗
                </a>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 text-sm text-slate-200 [overflow-wrap:anywhere]">
                {personal.email && (
                  <a href={`mailto:${personal.email}`} className="icon-link inline-flex items-center gap-3">
                    <span className="icon-hl flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-indigo-600">
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
                    <span className="icon-hl flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-indigo-600">
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
                      className="icon-hl flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-slate-200"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {personal.name}
        </p>
      </main>
    </div>
  );
}