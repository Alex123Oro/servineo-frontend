"use client";

import React from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#759AE0]">
      {children}
    </div>
  );
}
