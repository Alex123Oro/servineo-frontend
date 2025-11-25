import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="font-sans text-gray-900">
      {children}
    </div>
  );
}
