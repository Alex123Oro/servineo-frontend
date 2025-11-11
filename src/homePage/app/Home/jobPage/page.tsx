import React, { Suspense } from 'react'
import JobPageClient from './JobPageClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Cargando trabajo...</div>}>
      <JobPageClient />
    </Suspense>
  )
}
