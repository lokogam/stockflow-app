"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { FormCard } from "@/components/ui/FormCard";
import { UNIT_OPTIONS, type Brand, type ProductPayload } from "@/lib/types";
import { validateProduct } from "@/lib/validators";

interface ProductFormProps {
  mode: "create" | "edit";
  brands: Brand[];
  initialValues?: ProductPayload;
  loading?: boolean;
  serverError?: string;
  plain?: boolean;
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
  plain = false,
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

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.12em]">Nombre del producto</label>
        <input
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Ej: Galaxy S24 Ultra"
          autoFocus
          className="border-border bg-input-background placeholder:text-muted-foreground focus:ring-ring w-full border px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2"
        />
        {errors.name ? (
          <span className="text-destructive flex items-center gap-1 text-[11px] font-medium"><AlertCircle size={11} /> {errors.name}</span>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.12em]">Unidad de medida</label>
          <select
            value={values.unit_of_measure}
            onChange={(event) => setValues((prev) => ({ ...prev, unit_of_measure: event.target.value as ProductPayload["unit_of_measure"] }))}
            className="border-border bg-input-background focus:ring-ring w-full cursor-pointer appearance-none border px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2"
          >
            {UNIT_OPTIONS.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
          {errors.unit_of_measure ? (
            <span className="text-destructive flex items-center gap-1 text-[11px] font-medium"><AlertCircle size={11} /> {errors.unit_of_measure}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.12em]">Cantidad en inventario</label>
          <input
            type="number"
            min={0}
            value={values.inventory_quantity}
            onChange={(event) => setValues((prev) => ({ ...prev, inventory_quantity: Number.parseInt(event.target.value, 10) || 0 }))}
            className="border-border bg-input-background placeholder:text-muted-foreground focus:ring-ring w-full border px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2"
          />
          {errors.inventory_quantity ? (
            <span className="text-destructive flex items-center gap-1 text-[11px] font-medium"><AlertCircle size={11} /> {errors.inventory_quantity}</span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.12em]">Marca</label>
        <select
          value={String(values.brand_id)}
          onChange={(event) => setValues((prev) => ({ ...prev, brand_id: Number(event.target.value) }))}
          className="border-border bg-input-background focus:ring-ring w-full cursor-pointer appearance-none border px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2"
        >
          <option value="0">Selecciona una marca</option>
          {brands.map((brand) => (
            <option key={brand.id} value={String(brand.id)}>
              {brand.name} - {brand.reference}
            </option>
          ))}
        </select>
        {errors.brand_id ? (
          <span className="text-destructive flex items-center gap-1 text-[11px] font-medium"><AlertCircle size={11} /> {errors.brand_id}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.12em]">Observaciones</label>
        <textarea
          value={values.observations}
          onChange={(event) => setValues((prev) => ({ ...prev, observations: event.target.value }))}
          placeholder="Color, capacidad, caracteristicas especiales..."
          rows={3}
          className="border-border bg-input-background placeholder:text-muted-foreground focus:ring-ring w-full resize-none border px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2"
        />
        {errors.observations ? (
          <span className="text-destructive flex items-center gap-1 text-[11px] font-medium"><AlertCircle size={11} /> {errors.observations}</span>
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
          {loading ? "Guardando..." : mode === "create" ? "Crear producto" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );

  if (plain) {
    return formContent;
  }

  return (
    <FormCard
      title={mode === "create" ? "Crear producto" : "Editar producto"}
      subtitle="Todos los campos son obligatorios."
    >
      {formContent}
    </FormCard>
  );
}
