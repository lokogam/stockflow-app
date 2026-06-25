"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Edit2, LayoutDashboard, Plus, Search, Store, Trash2 } from "lucide-react";
import { ProductForm } from "@/components/forms/ProductForm";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import {
  ApiError,
  createProduct,
  deleteProduct,
  getBrands,
  getProducts,
  updateProduct,
} from "@/lib/api";
import { type Brand, type Product, type ProductPayload } from "@/lib/types";

const UNIT_BADGE_STYLES: Record<string, string> = {
  Unidad: "bg-blue-50 text-blue-700 border border-blue-200",
  Display: "bg-amber-50 text-amber-700 border border-amber-200",
  Caja: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterUnit, setFilterUnit] = useState("");

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + product.inventory_quantity, 0),
    [products]
  );

  const lowStock = useMemo(
    () => products.filter((product) => product.inventory_quantity < 10 && product.inventory_quantity > 0).length,
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const brand = brands.find((item) => item.id === product.brand_id);

      const matchesSearch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        (brand?.name ?? "").toLowerCase().includes(query);

      const matchesBrand = filterBrand.length === 0 || String(product.brand_id) === filterBrand;
      const matchesUnit = filterUnit.length === 0 || product.unit_of_measure === filterUnit;

      return matchesSearch && matchesBrand && matchesUnit;
    });
  }, [brands, filterBrand, filterUnit, products, search]);

  async function fetchProductsAndBrands() {
    return Promise.all([getProducts(), getBrands()]);
  }

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const [productsData, brandsData] = await fetchProductsAndBrands();
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

  function formatUpdatedDate(value?: string): string {
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
          <Link href="/admin/products" className="bg-ring px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
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
              <Link href="/admin/products" className="bg-primary-foreground px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                Productos
              </Link>
              <Link href="/admin/brands" className="px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground/60 hover:text-primary-foreground">
                Marcas
              </Link>
            </div>
            <div className="ml-auto hidden items-center gap-4 text-xs text-primary-foreground/50 sm:flex">
              <span>{brands.length} marcas · {products.length} productos · {totalStock.toLocaleString()} en stock</span>
              {lowStock > 0 ? (
                <span className="border border-amber-400/30 bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                  {lowStock} stock bajo
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl py-8">
        {brands.length === 0 ? (
          <div className="mb-4 flex items-center gap-2 border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <AlertCircle size={13} /> Cree al menos una marca antes de agregar productos.
          </div>
        ) : null}

        {errorMessage ? <p className="text-destructive mb-4 text-sm">{errorMessage}</p> : null}

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl leading-none">Productos</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {products.length} producto{products.length === 1 ? "" : "s"} - {totalStock.toLocaleString()} unidades en stock
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            disabled={brands.length === 0}
            className="bg-primary text-primary-foreground inline-flex shrink-0 items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={13} /> Nuevo producto
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={13} className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar producto o marca..."
              className="border-border bg-input-background focus:ring-ring w-full border py-2 pl-9 pr-3 text-sm transition-all focus:outline-none focus:ring-2"
            />
          </div>

          <select
            value={filterBrand}
            onChange={(event) => setFilterBrand(event.target.value)}
            className="border-border bg-input-background focus:ring-ring min-w-[160px] border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2"
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand.id} value={String(brand.id)}>
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={filterUnit}
            onChange={(event) => setFilterUnit(event.target.value)}
            className="border-border bg-input-background focus:ring-ring min-w-[140px] border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2"
          >
            <option value="">Todas las unidades</option>
            <option value="Unidad">Unidad</option>
            <option value="Display">Display</option>
            <option value="Caja">Caja</option>
          </select>
        </div>

        <div className="overflow-x-auto border border-border">
          <table className="min-w-[640px] w-full text-sm">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Producto</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Unidad</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Marca</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Stock</th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground lg:table-cell">Actualizado</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">Cargando productos...</td>
                </tr>
              ) : null}

              {!isLoading && filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                    {search || filterBrand || filterUnit ? "Sin resultados para la busqueda" : "Ningun producto registrado aun"}
                  </td>
                </tr>
              ) : null}

              {!isLoading
                ? filteredProducts.map((product, index) => {
                    const brand = brands.find((item) => item.id === product.brand_id);

                    return (
                      <tr key={product.id} className={`border-b border-border last:border-0 hover:bg-accent/60 ${index % 2 === 1 ? "bg-muted/20" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold leading-tight">{product.name}</div>
                          <div className="text-muted-foreground mt-0.5 max-w-[280px] line-clamp-1 text-xs">{product.observations}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-medium ${UNIT_BADGE_STYLES[product.unit_of_measure] ?? "bg-muted text-foreground border border-border"}`}>
                            {product.unit_of_measure}
                          </span>
                        </td>
                        <td className="text-muted-foreground px-4 py-3 text-sm">{brand?.name ?? "-"}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-base font-bold ${product.inventory_quantity === 0 ? "text-destructive" : product.inventory_quantity < 10 ? "text-amber-600" : "text-foreground"}`}>
                            {product.inventory_quantity.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-muted-foreground hidden px-4 py-3 text-xs lg:table-cell">{formatUpdatedDate(product.updated_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setSelectedProduct(product)} className="text-muted-foreground hover:text-foreground p-1.5 transition-colors hover:bg-accent" title="Editar">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => setDeleteTarget(product)} className="text-muted-foreground hover:text-destructive p-1.5 transition-colors hover:bg-destructive/10" title="Eliminar">
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
        <Modal title="Nuevo producto" onClose={() => setIsCreateOpen(false)}>
          <ProductForm
            key="create-product-modal"
            mode="create"
            plain
            brands={brands}
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

      {selectedProduct ? (
        <Modal title="Editar producto" onClose={() => setSelectedProduct(null)}>
          <ProductForm
            key={`edit-product-${selectedProduct.id}`}
            mode="edit"
            plain
            brands={brands}
            initialValues={{
              name: selectedProduct.name,
              unit_of_measure: selectedProduct.unit_of_measure,
              observations: selectedProduct.observations,
              brand_id: selectedProduct.brand_id,
              inventory_quantity: selectedProduct.inventory_quantity,
            }}
            loading={isSaving}
            serverError={errorMessage}
            onSubmit={async (payload) => {
              await handleSubmit(payload);
              setSelectedProduct(null);
            }}
            onCancelEdit={() => setSelectedProduct(null)}
          />
        </Modal>
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          message={`¿Eliminar "${deleteTarget.name}"? Esta accion no puede deshacerse.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await handleDelete(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      ) : null}
    </main>
  );
}
