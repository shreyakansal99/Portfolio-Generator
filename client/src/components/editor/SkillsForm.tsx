import { useState, type KeyboardEvent } from "react";
import { inputClass, labelClass } from "./styles";

interface Props {
  defaultValues: string[];
  onSave: (data: string[]) => void;
}

export default function SkillsForm({ defaultValues, onSave }: Props) {
  const [skills, setSkills] = useState<string[]>(defaultValues);
  const [input, setInput] = useState("");

  const addSkills = () => {
    const newOnes = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setSkills((prev) => {
      const next = [...prev];
      for (const s of newOnes) {
        if (!next.some((x) => x.toLowerCase() === s.toLowerCase())) next.push(s);
      }
      return next;
    });
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkills();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Add skills (press Enter, or separate with commas)</label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="React, TypeScript, MongoDB"
            className={inputClass}
          />
          <button
            type="button"
            onClick={addSkills}
            className="mt-1 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Add
          </button>
        </div>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-slate-500">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
            >
              {skill}
              <button
                type="button"
                onClick={() => setSkills((prev) => prev.filter((s) => s !== skill))}
                className="text-indigo-400 hover:text-indigo-700"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onSave(skills)}
        className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500"
      >
        Save
      </button>
    </div>
  );
}