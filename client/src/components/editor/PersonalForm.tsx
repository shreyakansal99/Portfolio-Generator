import { useForm } from "react-hook-form";
import type { Personal } from "../../types/portfolio";

interface Props {
  defaultValues: Personal;
  onSave: (data: Personal) => void;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500";

export default function PersonalForm({ defaultValues, onSave }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Personal>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Full name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className={inputClass}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Professional title</label>
          <input
            {...register("title")}
            placeholder="e.g. Full Stack Developer"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            {...register("email", {
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
            className={inputClass}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Phone</label>
          <input {...register("phone")} className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Location</label>
          <input {...register("location")} placeholder="City, Country" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Summary</label>
        <textarea
          rows={4}
          {...register("summary")}
          placeholder="A short introduction about you"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">LinkedIn</label>
          <input {...register("linkedin")} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">GitHub</label>
          <input {...register("github")} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Website</label>
          <input {...register("website")} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500"
      >
        Save
      </button>
    </form>
  );
}