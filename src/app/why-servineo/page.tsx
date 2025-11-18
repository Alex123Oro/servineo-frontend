"use client";

import React from "react";
import ComparisonTable from "../components/hu9/ComparisonTable";

export default function WhyServineoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Why Servineo
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sección donde mostramos por qué un usuario debería elegir Servineo
            frente a otras alternativas.
          </p>
        </header>

        {/* Cuadro comparativo HU9 */}
        <ComparisonTable />
      </section>
    </main>
  );
}


