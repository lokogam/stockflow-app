"use client";

import { useState } from "react";
import { FormCard } from "@/components/ui/FormCard";
import { Field } from "@/components/ui/Field";
import { validateBrand } from "@/lib/validators";
import { type BrandPayload } from "@/lib/types";

interface BrandFormProps {
  mode: "create" | "edit";
  initialValues?: BrandPayload;
  loading?: boolean;
  serverError?: string;
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

  return (
    <FormCard title={title} subtitle="Todos los campos son obligatorios.">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field
          label="Nombre"
          name="name"
          value={values.name}
          error={errors.name}
          placeholder="Ejemplo: Acme"
          onChange={(value) => setValues((prev) => ({ ...prev, name: value }))}
        />

        <Field
          label="Referencia"
          name="reference"
          value={values.reference}
          error={errors.reference}
          placeholder="Ejemplo: MRC-001"
          onChange={(value) => setValues((prev) => ({ ...prev, reference: value }))}
        />

        {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
          </button>
          {mode === "edit" ? (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </FormCard>
  );
}
