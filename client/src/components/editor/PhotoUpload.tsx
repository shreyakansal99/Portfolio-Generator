import { useRef, useState, type ChangeEvent } from "react";
import { isAxiosError } from "axios";
import api from "../../api/axios";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  photoUrl: string;
  onChange: (url: string) => void;
}

export default function PhotoUpload({ photoUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG or WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image is too large. Maximum size is 2 MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await api.post("/portfolio/photo", formData);
      onChange(res.data.photoUrl);
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

  return (
    <div className="mb-6 flex items-center gap-4">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Profile"
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500">
          No photo
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {uploading ? "Uploading..." : photoUrl ? "Change photo" : "Upload photo"}
        </button>
        <p className="mt-1 text-xs text-slate-500">JPG, PNG or WEBP, up to 2 MB</p>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}