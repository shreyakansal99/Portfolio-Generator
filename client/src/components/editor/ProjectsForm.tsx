import { useForm, useFieldArray } from "react-hook-form";
import type { Project } from "../../types/portfolio";
import { inputClass, labelClass } from "./styles";
import ProjectImageUpload from "./ProjectImageUpload";

interface Props {
  defaultValues: Project[];
  onSave: (data: Project[]) => void;
}

interface Item {
  name: string;
  description: string;
  tech: string; // comma separated in the form
  github: string;
  live: string;
  image: string;
}

interface FormValues {
  items: Item[];
}

const emptyItem: Item = { name: "", description: "", tech: "", github: "", live: "", image: "" };

export default function ProjectsForm({ defaultValues, onSave }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      items: defaultValues.map((p) => ({ ...p, image: p.image ?? "", tech: p.tech.join(", ") })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const submit = (values: FormValues) => {
    onSave(
      values.items.map((p) => ({
        ...p,
        tech: p.tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }))
    );
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {fields.length === 0 && (
        <p className="text-sm text-slate-500">No projects added yet.</p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-xl border border-slate-200 p-4">
          <ProjectImageUpload
            url={watch(`items.${index}.image`)}
            onChange={(u) => setValue(`items.${index}.image`, u, { shouldDirty: true })}
          />
          <input type="hidden" {...register(`items.${index}.image`)} />
          <div>
            <label className={labelClass}>Project name</label>
            <input
              {...register(`items.${index}.name`, { required: "Project name is required" })}
              className={inputClass}
            />
            {errors.items?.[index]?.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.items[index]?.name?.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              {...register(`items.${index}.description`)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Technologies (comma separated)</label>
            <input
              {...register(`items.${index}.tech`)}
              placeholder="React, Node.js, MongoDB"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>GitHub link</label>
              <input {...register(`items.${index}.github`)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Live link</label>
              <input {...register(`items.${index}.live`)} className={inputClass} />
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
          + Add project
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