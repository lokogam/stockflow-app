"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductForm } from "@/components/forms/ProductForm";
import {
  ApiError,
  createProduct,
  deleteProduct,
  getBrands,
  getProducts,
  updateProduct,
} from "@/lib/api";
import { type Brand, type Product, type ProductPayload } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const mode = useMemo(() => (selectedProduct ? "edit" : "create"), [selectedProduct]);

  async function fetchProductsAndBrands() {
    return Promise.all([getProducts(), getBrands()]);
  }

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [productsData, brandsData] = await Promise.all([getProducts(), getBrands()]);
      setProducts(productsData);
      setBrands(brandsData);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudieron cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const loadOnMount = async () => {
      try {
        const [productsData, brandsData] = await fetchProductsAndBrands();
        setProducts(productsData);
        setBrands(brandsData);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "No se pudieron cargar los productos.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadOnMount();
  }, []);

  async function handleSubmit(payload: ProductPayload) {
    try {
      setIsSaving(true);
      setErrorMessage("");

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      await loadData();
      setSelectedProduct(null);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage("No se pudo guardar el producto.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Estas seguro de eliminar este producto?");
    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      await deleteProduct(id);
      await loadData();
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo eliminar el producto.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[420px_1fr]">
        <ProductForm
          key={selectedProduct ? `edit-${selectedProduct.id}` : "create-product"}
          mode={mode}
          brands={brands}
          initialValues={
            selectedProduct
              ? {
                  name: selectedProduct.name,
                  unit_of_measure: selectedProduct.unit_of_measure,
                  observations: selectedProduct.observations,
                  brand_id: selectedProduct.brand_id,
                  inventory_quantity: selectedProduct.inventory_quantity,
                }
              : undefined
          }
          loading={isSaving}
          serverError={errorMessage}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedProduct(null)}
        />

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-zinc-900">Productos</h1>
            <button
              onClick={() => void loadData()}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Recargar
            </button>
          </header>

          {isLoading ? <p className="text-sm text-zinc-600">Cargando productos...</p> : null}
          {!isLoading && products.length === 0 ? (
            <p className="text-sm text-zinc-600">No hay productos registrados.</p>
          ) : null}

          <div className="grid gap-3">
            {products.map((product) => (
              <article key={product.id} className="rounded-lg border border-zinc-200 p-4">
                <p className="text-base font-semibold text-zinc-900">{product.name}</p>
                <p className="text-sm text-zinc-600">Unidad: {product.unit_of_measure}</p>
                <p className="text-sm text-zinc-600">Marca: {product.brand?.name ?? "Sin marca"}</p>
                <p className="text-sm text-zinc-600">
                  Inventario: {product.inventory_quantity}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => void handleDelete(product.id)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
