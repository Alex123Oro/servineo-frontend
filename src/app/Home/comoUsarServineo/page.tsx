
import React, { Suspense } from 'react';
import { Title } from '@/components/howUseServineoComponents/Title';
import { Pasos } from '@/components/howUseServineoComponents/Pasos';
import { Consejos } from '@/components/howUseServineoComponents/Consejos';
import Footer from '../Footer';

export default function Page() {
    return (
      <Suspense fallback={<div className="p-6">Cargando trabajo...</div>}>
        <Title />
        <Pasos />       
        <Consejos />
        <Footer />
      </Suspense>
    )
}