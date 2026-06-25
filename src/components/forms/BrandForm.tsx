"use client";

import { useState } from "react";
import { FormCard } from "@/components/ui/FormCard";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
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
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
          </Button>
          {mode === "edit" ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>
    </FormCard>
  );
}
