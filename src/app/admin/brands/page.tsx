"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit2, LayoutDashboard, Store, Trash2 } from "lucide-react";
import { BrandForm } from "@/components/forms/BrandForm";
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
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="bg-foreground text-primary-foreground -mx-4 -mt-8 mb-6 sm:-mx-6">
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

      <div className="mx-auto mb-6 flex w-full max-w-7xl items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Panel Administrativo</p>
          <h1 className="text-4xl leading-none">Gestion de Marcas</h1>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[380px_1fr]">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Marcas</CardTitle>
              <CardDescription>Tabla administrativa con acciones de editar y eliminar</CardDescription>
            </div>
            <Button variant="outline" onClick={() => void loadBrands()}>
              Recargar
            </Button>
          </CardHeader>
          <CardContent>

          {isLoading ? <p className="text-sm text-muted-foreground">Cargando marcas...</p> : null}
          {!isLoading && brands.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay marcas registradas.</p>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-semibold">{brand.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{brand.reference}</Badge>
                  </TableCell>
                  <TableCell>{brand.products_count ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelectedBrand(brand)} className="text-muted-foreground hover:text-foreground inline-flex p-1.5 hover:bg-accent">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => void handleDelete(brand.id)} className="text-muted-foreground hover:text-destructive inline-flex p-1.5 hover:bg-destructive/10">
                        <Trash2 size={13} />
                      </button>
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
