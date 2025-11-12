import React from "react";

export default function CloseSessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-5xl mx-auto p-6">
        {children}
      </div>
    </section>
  );
}
