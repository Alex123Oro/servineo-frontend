import ServiciosPage from './servicios';

export default function Page() {
  return <ServiciosPage 
    showHero={true} 
    showAllServices={true} 
    showCTA={false} 
    title="Todos Nuestros Servicios"
    subtitle="Explora la gama completa de soluciones que ofrecemos para tu hogar"
  />;
}