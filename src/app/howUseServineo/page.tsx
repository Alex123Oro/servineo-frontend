import React, { Suspense } from 'react'
import {Title} from '@/Components/HowUseServineo/Title'
import { Pasos } from '@/Components/HowUseServineo/Pasos'
import { Consejos } from '@/Components/HowUseServineo/Consejos'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Cargando página...</div>}>
        <Title/>
        <Pasos />
        <Consejos />
    </Suspense>
  )
}
