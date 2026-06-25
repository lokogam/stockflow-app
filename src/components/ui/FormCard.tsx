import { type ReactNode } from "react";

interface FormCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function FormCard({ title, subtitle, children }: FormCardProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <header className="mb-5">
        <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
        <p className="text-sm text-zinc-600">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}
