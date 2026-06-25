"use client";

import { useState } from "react";
import { FormCard } from "@/components/ui/FormCard";
import { Field } from "@/components/ui/Field";
import { SelectField } from "@/components/ui/SelectField";
import { UNIT_OPTIONS, type Brand, type ProductPayload } from "@/lib/types";
import { validateProduct } from "@/lib/validators";

interface ProductFormProps {
  mode: "create" | "edit";
  brands: Brand[];
  initialValues?: ProductPayload;
  loading?: boolean;
  serverError?: string;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  onCancelEdit?: () => void;
}

const DEFAULT_VALUES: ProductPayload = {
  name: "",
  unit_of_measure: "Unidad",
  observations: "",
  brand_id: 0,
  inventory_quantity: 0,
};

export function ProductForm({
  mode,
  brands,
  initialValues,
  loading = false,
  serverError,
  onSubmit,
  onCancelEdit,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductPayload>(initialValues ?? DEFAULT_VALUES);
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "unit_of_measure" | "brand_id" | "inventory_quantity" | "observations", string>>
  >({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateProduct(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      ...values,
      name: values.name.trim(),
      observations: values.observations.trim(),
    });

    if (mode === "create") {
      setValues(DEFAULT_VALUES);
    }
  }

  const brandOptions = [
    { value: "0", label: "Selecciona una marca" },
    ...brands.map((brand) => ({ value: String(brand.id), label: `${brand.name} (${brand.reference})` })),
  ];

  return (
    <FormCard
      title={mode === "create" ? "Crear producto" : "Editar producto"}
      subtitle="Todos los campos son obligatorios."
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field
          label="Nombre"
          name="name"
          value={values.name}
          error={errors.name}
          placeholder="Ejemplo: Gaseosa 350ml"
          onChange={(value) => setValues((prev) => ({ ...prev, name: value }))}
        />

        <SelectField
          label="Unidad de medida"
          name="unit_of_measure"
          value={values.unit_of_measure}
          error={errors.unit_of_measure}
          options={UNIT_OPTIONS.map((unit) => ({ value: unit, label: unit }))}
          onChange={(value) =>
            setValues((prev) => ({
              ...prev,
              unit_of_measure: value as ProductPayload["unit_of_measure"],
            }))
          }
        />

        <SelectField
          label="Marca"
          name="brand_id"
          value={String(values.brand_id)}
          error={errors.brand_id}
          options={brandOptions}
          onChange={(value) =>
            setValues((prev) => ({
              ...prev,
              brand_id: Number(value),
            }))
          }
        />

        <Field
          label="Cantidad en inventario"
          name="inventory_quantity"
          value={String(values.inventory_quantity)}
          error={errors.inventory_quantity}
          placeholder="Ejemplo: 25"
          onChange={(value) =>
            setValues((prev) => ({
              ...prev,
              inventory_quantity: Number(value),
            }))
          }
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="observations" className="text-sm font-medium text-zinc-700">
            Observaciones
          </label>
          <textarea
            id="observations"
            name="observations"
            value={values.observations}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                observations: event.target.value,
              }))
            }
            className="min-h-24 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-500"
          />
          {errors.observations ? <p className="text-xs text-red-600">{errors.observations}</p> : null}
        </div>

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
