"use client";

import { useEffect, useMemo, useState } from "react";
import { BrandForm } from "@/components/forms/BrandForm";
import { ApiError, createBrand, deleteBrand, getBrands, updateBrand } from "@/lib/api";
import { type Brand, type BrandPayload } from "@/lib/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const mode = useMemo(() => (selectedBrand ? "edit" : "create"), [selectedBrand]);

  async function fetchBrandsData() {
    return getBrands();
  }

  async function loadBrands() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudieron cargar las marcas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const loadOnMount = async () => {
      try {
        const data = await fetchBrandsData();
        setBrands(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "No se pudieron cargar las marcas.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadOnMount();
  }, []);

  async function handleSubmit(payload: BrandPayload) {
    try {
      setIsSaving(true);
      setErrorMessage("");

      if (selectedBrand) {
        await updateBrand(selectedBrand.id, payload);
      } else {
        await createBrand(payload);
      }

      await loadBrands();
      setSelectedBrand(null);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage("No se pudo guardar la marca.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Estas seguro de eliminar esta marca?");
    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      await deleteBrand(id);
      await loadBrands();
      if (selectedBrand?.id === id) {
        setSelectedBrand(null);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo eliminar la marca.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[380px_1fr]">
        <BrandForm
          key={selectedBrand ? `edit-${selectedBrand.id}` : "create-brand"}
          mode={mode}
          initialValues={
            selectedBrand
              ? {
                  name: selectedBrand.name,
                  reference: selectedBrand.reference,
                }
              : undefined
          }
          loading={isSaving}
          serverError={errorMessage}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedBrand(null)}
        />

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-zinc-900">Marcas</h1>
            <button
              onClick={() => void loadBrands()}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Recargar
            </button>
          </header>

          {isLoading ? <p className="text-sm text-zinc-600">Cargando marcas...</p> : null}
          {!isLoading && brands.length === 0 ? (
            <p className="text-sm text-zinc-600">No hay marcas registradas.</p>
          ) : null}

          <div className="grid gap-3">
            {brands.map((brand) => (
              <article key={brand.id} className="rounded-lg border border-zinc-200 p-4">
                <p className="text-base font-semibold text-zinc-900">{brand.name}</p>
                <p className="text-sm text-zinc-600">Referencia: {brand.reference}</p>
                <p className="text-sm text-zinc-600">
                  Productos asociados: {brand.products_count ?? 0}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setSelectedBrand(brand)}
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => void handleDelete(brand.id)}
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
