"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { FormCard } from "@/components/ui/FormCard";
import { validateBrand } from "@/lib/validators";
import { type BrandPayload } from "@/lib/types";

interface BrandFormProps {
  mode: "create" | "edit";
  initialValues?: BrandPayload;
  loading?: boolean;
  serverError?: string;
  plain?: boolean;
  onSubmit: (payload: BrandPayload) => Promise<void>;
  onCancelEdit?: () => void;
}

const DEFAULT_VALUES: BrandPayload = {
  name: "",
  reference: "",
};

export function BrandForm({
  mode,
  initialValues,
  loading = false,
  serverError,
  plain = false,
  onSubmit,
  onCancelEdit,
}: BrandFormProps) {
  const [values, setValues] = useState<BrandPayload>(initialValues ?? DEFAULT_VALUES);
  const [errors, setErrors] = useState<Partial<Record<"name" | "reference", string>>>({});

  const title = mode === "create" ? "Crear marca" : "Editar marca";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateBrand(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      reference: values.reference.trim(),
    });

    if (mode === "create") {
      setValues(DEFAULT_VALUES);
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.12em]">Nombre de la marca</label>
        <input
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Ej: Samsung Electronics"
          autoFocus
          className="border-border bg-input-background placeholder:text-muted-foreground focus:ring-ring w-full border px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2"
        />
        {errors.name ? (
          <span className="text-destructive flex items-center gap-1 text-[11px] font-medium">
            <AlertCircle size={11} /> {errors.name}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.12em]">Referencia (ID)</label>
        <input
          value={values.reference}
          onChange={(event) => setValues((prev) => ({ ...prev, reference: event.target.value }))}
          placeholder="Ej: SAM-001"
          className="border-border bg-input-background placeholder:text-muted-foreground focus:ring-ring w-full border px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2"
        />
        {errors.reference ? (
          <span className="text-destructive flex items-center gap-1 text-[11px] font-medium">
            <AlertCircle size={11} /> {errors.reference}
          </span>
        ) : null}
      </div>

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => onCancelEdit?.()}
          className="border-border hover:bg-muted px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Guardando..." : mode === "create" ? "Crear marca" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );

  if (plain) {
    return formContent;
  }

  return (
    <FormCard title={title} subtitle="Todos los campos son obligatorios.">
      {formContent}
    </FormCard>
  );
}
