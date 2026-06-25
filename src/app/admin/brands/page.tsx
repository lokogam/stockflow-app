"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Edit2, LayoutDashboard, Plus, Store, Trash2, X } from "lucide-react";
import { BrandForm } from "@/components/forms/BrandForm";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { ApiError, createBrand, deleteBrand, getBrands, updateBrand } from "@/lib/api";
import { type Brand, type BrandPayload } from "@/lib/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [inlineAlert, setInlineAlert] = useState("");

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

  function formatCreatedDate(value?: string): string {
    if (!value) {
      return "-";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="bg-foreground text-primary-foreground -mx-4 -mt-8 sm:-mx-6">
        <div className="mx-auto flex h-8 w-full max-w-7xl items-center gap-2 px-4 sm:px-6">
          <span className="mr-2 text-[10px] uppercase tracking-widest text-primary-foreground/45">Vista actual:</span>
          <Link href="/store" className="px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/60 hover:text-primary-foreground/90">
            <span className="inline-flex items-center gap-1.5"><Store size={10} /> Tienda</span>
          </Link>
          <Link href="/admin/brands" className="bg-ring px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
            <span className="inline-flex items-center gap-1.5"><LayoutDashboard size={10} /> Administracion</span>
          </Link>
        </div>
      </div>

      <header className="bg-primary text-primary-foreground -mx-4 sm:-mx-6">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center gap-4">
            <div className="flex shrink-0 items-center gap-2.5">
              <LayoutDashboard size={16} />
              <span className="text-sm font-bold uppercase tracking-[0.15em]">Panel de Administracion</span>
            </div>
            <div className="mx-1 h-5 w-px bg-primary-foreground/20" />
            <div className="flex items-center gap-1">
              <Link href="/admin/products" className="px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground/60 hover:text-primary-foreground">
                Productos
              </Link>
              <Link href="/admin/brands" className="bg-primary-foreground px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                Marcas
              </Link>
            </div>
            <div className="ml-auto hidden items-center gap-4 text-xs text-primary-foreground/50 sm:flex">
              <span>{brands.length} marcas</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl py-8">
        {inlineAlert ? (
          <div className="mb-4 flex items-center gap-2 border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle size={14} />
            <span>{inlineAlert}</span>
            <button onClick={() => setInlineAlert("")} className="ml-auto p-0.5 text-destructive/80 hover:text-destructive" aria-label="Cerrar alerta">
              <X size={14} />
            </button>
          </div>
        ) : null}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl leading-none">Marcas</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {brands.length} marca{brands.length === 1 ? "" : "s"} registrada{brands.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary text-primary-foreground inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest hover:opacity-90"
            >
              <Plus size={13} />
              Nueva marca
            </button>
            <button
              onClick={() => void loadBrands()}
              className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest hover:bg-muted"
            >
              Recargar
            </button>
          </div>
        </div>

        <div className="overflow-hidden border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Referencia</th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:table-cell">Fecha creacion</th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:table-cell">Productos</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">Cargando marcas...</td>
                </tr>
              ) : null}

              {!isLoading && brands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">Ninguna marca registrada aun</td>
                </tr>
              ) : null}

              {!isLoading
                ? brands.map((brand, index) => {
                    const productsCount = brand.products_count ?? 0;

                    return (
                      <tr key={brand.id} className={`border-b border-border last:border-0 hover:bg-accent/60 ${index % 2 === 1 ? "bg-muted/20" : ""}`}>
                        <td className="px-4 py-3 text-sm font-semibold">{brand.name}</td>
                        <td className="px-4 py-3">
                          <span className="border border-border bg-muted px-2 py-0.5 text-xs">{brand.reference}</span>
                        </td>
                        <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">{formatCreatedDate(brand.created_at)}</td>
                        <td className="hidden px-4 py-3 text-xs font-semibold sm:table-cell">
                          {productsCount} producto{productsCount === 1 ? "" : "s"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setSelectedBrand(brand)} className="p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" title="Editar">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => setDeleteTarget(brand)} className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Eliminar">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen ? (
        <Modal title="Nueva marca" onClose={() => setIsCreateOpen(false)}>
          <BrandForm
            key="create-brand-modal"
            mode="create"
            plain
            loading={isSaving}
            serverError={errorMessage}
            onSubmit={async (payload) => {
              await handleSubmit(payload);
              setIsCreateOpen(false);
            }}
            onCancelEdit={() => setIsCreateOpen(false)}
          />
        </Modal>
      ) : null}

      {selectedBrand ? (
        <Modal title="Editar marca" onClose={() => setSelectedBrand(null)}>
          <BrandForm
            key={`edit-brand-${selectedBrand.id}`}
            mode="edit"
            plain
            initialValues={{ name: selectedBrand.name, reference: selectedBrand.reference }}
            loading={isSaving}
            serverError={errorMessage}
            onSubmit={async (payload) => {
              await handleSubmit(payload);
              setSelectedBrand(null);
            }}
            onCancelEdit={() => setSelectedBrand(null)}
          />
        </Modal>
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          message={`¿Eliminar la marca "${deleteTarget.name}" (${deleteTarget.reference})? Esta accion no puede deshacerse.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            const productsCount = deleteTarget.products_count ?? 0;

            if (productsCount > 0) {
              setInlineAlert(
                `No se puede eliminar: ${productsCount} producto${productsCount === 1 ? "" : "s"} usa${productsCount === 1 ? "" : "n"} esta marca.`
              );
              setDeleteTarget(null);
              return;
            }

            await handleDelete(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      ) : null}
    </main>
  );
}
