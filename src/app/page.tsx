import Link from "next/link";
import { LayoutDashboard, Store } from "lucide-react";
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
              Version con estilo Figma en paginas separadas: tienda publica, marcas y productos en administracion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link href="/store">
                <Button><span className="inline-flex items-center gap-2"><Store size={14} /> Ir a Tienda</span></Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="outline"><span className="inline-flex items-center gap-2"><LayoutDashboard size={14} /> Ir a Admin Productos</span></Button>
              </Link>
              <Link href="/admin/brands">
                <Button variant="outline">Ir a Admin Marcas</Button>
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
