
import React, { Suspense } from 'react';
import { Title } from '@/components/howUseServineoComponents/Title';
import { Pasos } from '@/components/howUseServineoComponents/Pasos';
import { Consejos } from '@/components/howUseServineoComponents/Consejos';
import { Accordion } from '@/components/howUseServineoComponents/Accordion';

import Footer from '../Footer';

export default function Page() {
    return (
      <Suspense fallback={<div className="p-6">Cargando trabajo...</div>}>
        <Title />
        <Pasos />       
        <Consejos />
        <Accordion />
        <Footer />
        
      </Suspense>
    )
}