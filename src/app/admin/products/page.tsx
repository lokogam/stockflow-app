"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductForm } from "@/components/forms/ProductForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
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
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto mb-6 flex w-full max-w-7xl items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Panel Administrativo</p>
          <h1 className="text-4xl leading-none">Gestion de Productos</h1>
        </div>
      </div>

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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Productos</CardTitle>
              <CardDescription>Inventario completo con unidad, marca y acciones</CardDescription>
            </div>
            <Button variant="outline" onClick={() => void loadData()}>
              Recargar
            </Button>
          </CardHeader>
          <CardContent>

          {isLoading ? <p className="text-sm text-muted-foreground">Cargando productos...</p> : null}
          {!isLoading && products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay productos registrados.</p>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Inventario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-semibold">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.unit_of_measure}</Badge>
                  </TableCell>
                  <TableCell>{product.brand?.name ?? "Sin marca"}</TableCell>
                  <TableCell>{product.inventory_quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => setSelectedProduct(product)}>Editar</Button>
                      <Button variant="destructive" onClick={() => void handleDelete(product.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
