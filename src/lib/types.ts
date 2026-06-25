export type UnitOfMeasure = "Unidad" | "Display" | "Caja";

export interface Brand {
  id: number;
  name: string;
  reference: string;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Product {
  id: number;
  name: string;
  unit_of_measure: UnitOfMeasure;
  observations: string;
  brand_id: number;
  inventory_quantity: number;
  brand?: Brand;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface BrandPayload {
  name: string;
  reference: string;
}

export interface ProductPayload {
  name: string;
  unit_of_measure: UnitOfMeasure;
  observations: string;
  brand_id: number;
  inventory_quantity: number;
}

export interface ApiValidationError {
  message: string;
  errors?: Record<string, string[]>;
}

export const UNIT_OPTIONS: UnitOfMeasure[] = ["Unidad", "Display", "Caja"];
