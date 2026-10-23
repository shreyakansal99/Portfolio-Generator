import { useForm, useFieldArray } from "react-hook-form";
import type { Experience } from "../../types/portfolio";
import { inputClass, labelClass } from "./styles";

interface Props {
  defaultValues: Experience[];
  onSave: (data: Experience[]) => void;
}

interface Item {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  highlights: string; // one per line in the form
}

interface FormValues {
  items: Item[];
}

const emptyItem: Item = {
  company: "",
  role: "",
  location: "",
  start: "",
  end: "",
  highlights: "",
};

export default function ExperienceForm({ defaultValues, onSave }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      items: defaultValues.map((e) => ({ ...e, highlights: e.highlights.join("\n") })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const submit = (values: FormValues) => {
    onSave(
      values.items.map((i) => ({
        ...i,
        highlights: i.highlights
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean),
      }))
    );
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {fields.length === 0 && (
        <p className="text-sm text-slate-500">No experience added yet.</p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-xl border border-slate-200 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Company</label>
              <input
                {...register(`items.${index}.company`, { required: "Company is required" })}
                className={inputClass}
              />
              {errors.items?.[index]?.company && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.items[index]?.company?.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input
                {...register(`items.${index}.role`, { required: "Role is required" })}
                className={inputClass}
              />
              {errors.items?.[index]?.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.items[index]?.role?.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input {...register(`items.${index}.location`)} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start</label>
                <input
                  {...register(`items.${index}.start`)}
                  placeholder="Jan 2023"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>End</label>
                <input
                  {...register(`items.${index}.end`)}
                  placeholder="Present"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Highlights (one per line)</label>
            <textarea
              rows={4}
              {...register(`items.${index}.highlights`)}
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => append(emptyItem)}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          + Add experience
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}