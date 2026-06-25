import { type BrandPayload, type ProductPayload } from "./types";

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function validateBrand(values: BrandPayload): FieldErrors<"name" | "reference"> {
  const errors: FieldErrors<"name" | "reference"> = {};

  if (!values.name.trim()) {
    errors.name = "El nombre es obligatorio.";
  } else if (values.name.trim().length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres.";
  }

  if (!values.reference.trim()) {
    errors.reference = "La referencia es obligatoria.";
  } else if (!/^[a-zA-Z0-9_-]+$/.test(values.reference.trim())) {
    errors.reference = "Solo se permite formato alfanumerico, guion y guion bajo.";
  }

  return errors;
}

export function validateProduct(
  values: ProductPayload
): FieldErrors<"name" | "unit_of_measure" | "brand_id" | "inventory_quantity" | "observations"> {
  const errors: FieldErrors<
    "name" | "unit_of_measure" | "brand_id" | "inventory_quantity" | "observations"
  > = {};

  if (!values.name.trim()) {
    errors.name = "El nombre es obligatorio.";
  } else if (values.name.trim().length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres.";
  }

  if (!values.unit_of_measure) {
    errors.unit_of_measure = "Selecciona una unidad de medida.";
  }

  if (!values.brand_id || Number.isNaN(values.brand_id)) {
    errors.brand_id = "Selecciona una marca valida.";
  }

  if (Number.isNaN(values.inventory_quantity) || values.inventory_quantity < 0) {
    errors.inventory_quantity = "La cantidad debe ser un numero mayor o igual a 0.";
  }

  if (!values.observations.trim()) {
    errors.observations = "Las observaciones son obligatorias.";
  }

  return errors;
}
