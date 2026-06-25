import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            StockFlow
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Pagina de inicio
          </h1>

          <p className="mt-4 text-base text-zinc-600 sm:text-lg">
            Frontend base creado con Next.js, TypeScript y Tailwind CSS.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Inicio
            </Link>
            <Link
              href="/admin/brands"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Formularios de marcas
            </Link>
            <Link
              href="/admin/products"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Formularios de productos
            </Link>
            <a
              href="http://localhost:8000"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              API Laravel
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
