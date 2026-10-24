import { useForm, useFieldArray } from "react-hook-form";
import type { Certification } from "../../types/portfolio";
import { inputClass, labelClass } from "./styles";

interface Props {
  defaultValues: Certification[];
  onSave: (data: Certification[]) => void;
}

interface FormValues {
  items: Certification[];
}

const emptyItem: Certification = { name: "", issuer: "", year: "" };

export default function CertificationsForm({ defaultValues, onSave }: Props) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: { items: defaultValues } });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  return (
    <form onSubmit={handleSubmit((v) => onSave(v.items))} className="space-y-6">
      {fields.length === 0 && (
        <p className="text-sm text-slate-500">No certifications added yet.</p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-xl border border-slate-200 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-3">
              <label className={labelClass}>Certification name</label>
              <input
                {...register(`items.${index}.name`, { required: "Name is required" })}
                className={inputClass}
              />
              {errors.items?.[index]?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.items[index]?.name?.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Issuer</label>
              <input {...register(`items.${index}.issuer`)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <input {...register(`items.${index}.year`)} className={inputClass} />
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
          + Add certification
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