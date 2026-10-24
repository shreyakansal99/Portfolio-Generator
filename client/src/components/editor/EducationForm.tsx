import { useForm, useFieldArray } from "react-hook-form";
import type { Education } from "../../types/portfolio";
import { inputClass, labelClass } from "./styles";

interface Props {
  defaultValues: Education[];
  onSave: (data: Education[]) => void;
}

interface FormValues {
  items: Education[];
}

const emptyItem: Education = {
  institution: "",
  degree: "",
  field: "",
  start: "",
  end: "",
  grade: "",
};

export default function EducationForm({ defaultValues, onSave }: Props) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: { items: defaultValues } });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  return (
    <form onSubmit={handleSubmit((v) => onSave(v.items))} className="space-y-6">
      {fields.length === 0 && (
        <p className="text-sm text-slate-500">No education added yet.</p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-xl border border-slate-200 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>Institution</label>
              <input
                {...register(`items.${index}.institution`, { required: "Institution is required" })}
                className={inputClass}
              />
              {errors.items?.[index]?.institution && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.items[index]?.institution?.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Degree</label>
              <input
                {...register(`items.${index}.degree`)}
                placeholder="B.Tech"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Field of study</label>
              <input {...register(`items.${index}.field`)} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start</label>
                <input {...register(`items.${index}.start`)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>End</label>
                <input {...register(`items.${index}.end`)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Grade / CGPA</label>
              <input {...register(`items.${index}.grade`)} className={inputClass} />
            </div>
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
          + Add education
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