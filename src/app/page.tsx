import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-16">
        <Card className="w-full border-2">
          <CardHeader>
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.24em]">
              StockFlow
            </p>
            <CardTitle className="text-4xl leading-none">Catalogo Administrativo</CardTitle>
            <CardDescription className="max-w-2xl text-base">
              Proyecto conectado a Laravel API con formularios para crear, editar y eliminar marcas y productos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link href="/">
                <Button>Inicio</Button>
              </Link>
              <Link href="/admin/brands">
                <Button variant="outline">Formularios de marcas</Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="outline">Formularios de productos</Button>
              </Link>
              <a href="http://localhost:8000" target="_blank" rel="noreferrer">
                <Button variant="outline">API Laravel</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
