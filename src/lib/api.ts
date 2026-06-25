import {
  type ApiValidationError,
  type Brand,
  type BrandPayload,
  type Product,
  type ProductPayload,
} from "./types";
import axios from "./axios";
import { AxiosError, type Method } from "axios";

const API_PREFIX = "/api";

let csrfInitialized = false;

class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;

  constructor(status: number, message: string, details?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function getErrorMessage(payload: unknown): ApiValidationError {
  if (typeof payload === "object" && payload !== null && "message" in payload) {
    const p = payload as ApiValidationError;
    return {
      message: p.message || "Ocurrio un error en la solicitud.",
      errors: p.errors,
    };
  }

  return { message: "Ocurrio un error en la solicitud." };
}

async function ensureCsrfCookie(): Promise<void> {
  if (csrfInitialized) {
    return;
  }

  try {
    await axios.get("/sanctum/csrf-cookie");
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new ApiError(axiosError.response?.status ?? 500, "No se pudo inicializar la cookie CSRF.");
  }

  csrfInitialized = true;
}

function isMutation(method: string): boolean {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

async function request<T>(
  path: string,
  options?: { method?: Method; data?: unknown },
  retryOn419 = true
): Promise<T> {
  const method = (options?.method ?? "GET").toUpperCase();

  if (isMutation(method)) {
    await ensureCsrfCookie();
  }

  try {
    const response = await axios.request<T>({
      url: `${API_PREFIX}${path}`,
      method,
      data: options?.data,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiValidationError>;
    const status = axiosError.response?.status ?? 500;

    if (status === 419 && retryOn419 && isMutation(method)) {
      csrfInitialized = false;
      await ensureCsrfCookie();
      return request<T>(path, options, false);
    }

    const normalized = getErrorMessage(axiosError.response?.data);
    throw new ApiError(status, normalized.message, normalized.errors);
  }
}

function extractCollection<T>(payload: unknown): T[] {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown[] }).data)
  ) {
    return (payload as { data: T[] }).data;
  }

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  return [];
}

export async function getBrands(): Promise<Brand[]> {
  const payload = await request<unknown>("/brands");
  return extractCollection<Brand>(payload);
}

export async function createBrand(data: BrandPayload): Promise<Brand> {
  return request<Brand>("/brands", { method: "POST", data });
}

export async function updateBrand(id: number, data: BrandPayload): Promise<Brand> {
  return request<Brand>(`/brands/${id}`, { method: "PUT", data });
}

export async function deleteBrand(id: number): Promise<void> {
  await request<void>(`/brands/${id}`, { method: "DELETE" });
}

export async function getProducts(): Promise<Product[]> {
  const payload = await request<unknown>("/products");
  return extractCollection<Product>(payload);
}

export async function createProduct(data: ProductPayload): Promise<Product> {
  return request<Product>("/products", { method: "POST", data });
}

export async function updateProduct(id: number, data: ProductPayload): Promise<Product> {
  return request<Product>(`/products/${id}`, { method: "PUT", data });
}

export async function deleteProduct(id: number): Promise<void> {
  await request<void>(`/products/${id}`, { method: "DELETE" });
}

export { ApiError };
