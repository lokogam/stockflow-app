import {
  type ApiValidationError,
  type Brand,
  type BrandPayload,
  type Product,
  type ProductPayload,
} from "./types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api"
).replace(/\/$/, "");

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "http://localhost:8000";
  }
})();

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

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const prefixed = `${name}=`;
  const cookieParts = document.cookie.split(";");

  for (const raw of cookieParts) {
    const cookie = raw.trim();
    if (cookie.startsWith(prefixed)) {
      return decodeURIComponent(cookie.slice(prefixed.length));
    }
  }

  return null;
}

async function ensureCsrfCookie(): Promise<void> {
  if (csrfInitialized) {
    return;
  }

  const response = await fetch(`${API_ORIGIN}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, "No se pudo inicializar la cookie CSRF.");
  }

  csrfInitialized = true;
}

function isMutation(method: string): boolean {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

async function performRequest(url: string, init: RequestInit, retryOn419 = true): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();

  if (isMutation(method)) {
    await ensureCsrfCookie();
  }

  const token = readCookie("XSRF-TOKEN");
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (init.body !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (isMutation(method) && token) {
    headers["X-XSRF-TOKEN"] = token;
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 419 && retryOn419 && isMutation(method)) {
    csrfInitialized = false;
    await ensureCsrfCookie();
    return performRequest(url, init, false);
  }

  return response;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await performRequest(`${API_BASE_URL}${path}`, init ?? {});

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const normalized = getErrorMessage(payload);

    throw new ApiError(response.status, normalized.message, normalized.errors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
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
  return request<Brand>("/brands", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBrand(id: number, data: BrandPayload): Promise<Brand> {
  return request<Brand>(`/brands/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBrand(id: number): Promise<void> {
  await request<void>(`/brands/${id}`, { method: "DELETE" });
}

export async function getProducts(): Promise<Product[]> {
  const payload = await request<unknown>("/products");
  return extractCollection<Product>(payload);
}

export async function createProduct(data: ProductPayload): Promise<Product> {
  return request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: ProductPayload): Promise<Product> {
  return request<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  await request<void>(`/products/${id}`, { method: "DELETE" });
}

export { ApiError, API_BASE_URL };
