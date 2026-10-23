import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        Turn your resume into a portfolio
      </h1>
      <p className="mt-6 text-lg text-slate-600">
        Upload your resume and get a polished portfolio website in minutes.
        Your experience, projects, education, and skills, all in one place.
      </p>
      <Link
        to="/register"
        className="mt-10 inline-block rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500"
      >
        Create your portfolio
      </Link>
    </main>
  );
}