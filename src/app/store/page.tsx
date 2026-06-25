"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Search,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { getBrands, getProducts } from "@/lib/api";
import { type Brand, type Product } from "@/lib/types";

const UNIT_BADGE_STYLES: Record<string, string> = {
  Unidad: "bg-blue-50 text-blue-700 border border-blue-200",
  Display: "bg-amber-50 text-amber-700 border border-amber-200",
  Caja: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, brandsData] = await Promise.all([getProducts(), getBrands()]);
        setProducts(productsData);
        setBrands(brandsData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo cargar el catalogo.");
      }
    };

    void loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return products.filter((product) => {
      const brand = brands.find((b) => b.id === product.brand_id);
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (brand?.name ?? "").toLowerCase().includes(query);
      const matchesBrand = !filterBrand || String(product.brand_id) === filterBrand;
      const matchesUnit = !filterUnit || product.unit_of_measure === filterUnit;

      return matchesSearch && matchesBrand && matchesUnit;
    });
  }, [brands, filterBrand, filterUnit, products, search]);

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-foreground text-primary-foreground">
        <div className="mx-auto flex h-8 w-full max-w-7xl items-center gap-2 px-4 sm:px-6">
          <span className="mr-2 text-[10px] uppercase tracking-widest text-primary-foreground/45">
            Vista actual:
          </span>
          <Link href="/store" className="bg-ring px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
            <span className="inline-flex items-center gap-1.5"><Store size={10} /> Tienda</span>
          </Link>
          <Link href="/admin/products" className="px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/60 hover:text-primary-foreground/90">
            <span className="inline-flex items-center gap-1.5"><LayoutDashboard size={10} /> Administracion</span>
          </Link>
        </div>
      </div>

      <nav className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-2.5">
            <ShoppingBag size={18} className="text-primary" />
            <span className="font-semibold uppercase tracking-[0.15em]">TiendApp</span>
            <span className="hidden text-[10px] text-muted-foreground sm:block">Catalogo</span>
          </div>

          <div className="relative w-full max-w-sm">
            <Search size={13} className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar productos..."
              className="border-input bg-input-background h-9 w-full border pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground md:block">
              {filteredProducts.length} de {products.length} productos
            </span>
            <button className="group relative p-2 transition-colors hover:bg-muted">
              <ShoppingBag size={18} />
              {cartCount > 0 ? (
                <span className="bg-ring absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </nav>

      <div className="border-b border-border bg-muted/40">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-2.5 sm:px-6">
          <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.12em]">Filtrar:</span>

          <select
            value={filterBrand}
            onChange={(event) => setFilterBrand(event.target.value)}
            className="border-input bg-card border px-3 py-1 text-xs outline-none transition focus:ring-2 focus:ring-ring"
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
            className="border-input bg-card border px-3 py-1 text-xs outline-none transition focus:ring-2 focus:ring-ring"
          >
            <option value="">Todas las unidades</option>
            <option value="Unidad">Unidad</option>
            <option value="Display">Display</option>
            <option value="Caja">Caja</option>
          </select>

          {search || filterBrand || filterUnit ? (
            <button
              onClick={() => {
                setSearch("");
                setFilterBrand("");
                setFilterUnit("");
              }}
              className="text-destructive inline-flex items-center gap-1 text-[11px] font-semibold"
            >
              <X size={11} /> Limpiar
            </button>
          ) : null}
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {error ? <p className="text-destructive mb-4 text-sm">{error}</p> : null}

        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground text-sm">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const brand = brands.find((b) => b.id === product.brand_id);
              const inStock = product.inventory_quantity > 0;

              return (
                <Card key={product.id} className="group flex flex-col overflow-hidden border border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="relative h-52 overflow-hidden bg-muted">
                    <Image
                      src="/generic-product.svg"
                      alt={product.name}
                      width={480}
                      height={320}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute left-3 top-3">
                      <Badge className={inStock ? "bg-emerald-500 text-white border border-emerald-600" : "bg-foreground/80 text-white"}>
                        {inStock ? "En stock" : "Agotado"}
                      </Badge>
                    </div>
                    <div className="absolute right-3 top-3">
                      <span className={`px-2 py-0.5 text-[10px] font-medium ${UNIT_BADGE_STYLES[product.unit_of_measure] ?? "bg-muted text-foreground border border-border"}`}>
                        {product.unit_of_measure}
                      </span>
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col gap-2 p-4">
                    {brand ? (
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                        <span>{brand.reference}</span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="font-semibold">{brand.name}</span>
                      </div>
                    ) : null}

                    <h3 className="text-xl uppercase tracking-[0.03em]">{product.name}</h3>
                    <p className="text-muted-foreground line-clamp-2 flex-1 text-xs leading-relaxed">
                      {product.observations}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
                      <div>
                        <span className="font-bold">{product.inventory_quantity.toLocaleString()}</span>
                        <span className="text-muted-foreground ml-1 text-xs">disponibles</span>
                      </div>
                      <button
                        disabled={!inStock}
                        onClick={() => setCartCount((prev) => prev + 1)}
                        className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ShoppingBag size={11} /> Agregar
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
