import { useEffect, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { isAxiosError } from "axios";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const STEPS = [
  "Reading your resume...",
  "Finding your experience and education...",
  "Organizing your projects and skills...",
  "Building your portfolio...",
];

export default function Upload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uploading) return;
    const id = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 3500);
    return () => clearInterval(id);
  }, [uploading]);

  const validateAndSet = (selected: File | undefined) => {
    setError("");
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Only PDF or DOCX files are allowed.");
      setFile(null);
      return;
    }
    if (selected.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 5 MB.");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    validateAndSet(e.dataTransfer.files[0]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndSet(e.target.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setStepIndex(0);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      await api.post("/resume/upload", formData);
      navigate("/preview");
    } catch (err) {
      setError(
        isAxiosError(err)
          ? err.response?.data?.message || "Upload failed"
          : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Upload your resume</h1>
      <p className="mt-2 text-slate-600">
        We'll read your resume and build your portfolio from it.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition ${dragging
          ? "border-indigo-500 bg-indigo-50"
          : "border-slate-300 bg-white hover:border-indigo-400"
          }`}
      >
        <p className="font-medium text-slate-900">
          Drag and drop your resume here
        </p>
        <p className="mt-1 text-sm text-slate-500">
          or click to browse (PDF or DOCX, max 5 MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {file && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">{file.name}</p>
            <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Analyzing your resume..." : "Upload and generate portfolio"}
      </button>

      {uploading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-6 text-lg font-semibold text-slate-900">{STEPS[stepIndex]}</p>
          <p className="mt-2 text-sm text-slate-500">
            This can take up to 30 seconds. Please don't close this page.
          </p>
        </div>
      )}

    </main>
  );
}