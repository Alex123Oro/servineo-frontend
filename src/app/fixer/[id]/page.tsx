import { notFound } from "next/navigation";
import { mockFixers, Fixer } from "@/app/lib/mock-data";
import { FixerProfileContent } from "./FixerProfileContent";
import jsonFixers from "@/jsons/fixers.json"; 

export default async function AboutFixerProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // CORRECCIÓN: Tipado explícito para evitar el error de 'email' incompatible
  let fixer: Fixer | undefined = mockFixers.find((f) => f.id === id);

  // Si no existe en los datos principales, buscamos en los del mapa
  if (!fixer) {
    const mapFixer = jsonFixers.find((f) => f.id.toString() === id);

    if (mapFixer) {
      // Creamos un objeto compatible con la interfaz Fixer
      fixer = {
        id: mapFixer.id.toString(),
        name: mapFixer.nombre,
        city: "Cochabamba", 
        rating: 5.0,
        completedJobs: 1,
        services: [mapFixer.servicio],
        bio: `Profesional especialista en ${mapFixer.servicio}. Disponible para trabajos en ${mapFixer.zona || 'tu zona'}.`,
        joinDate: new Date(),
        jobOffers: [],
        paymentMethods: ["Efectivo"],
        phone: "+591 00000000",
        email: "contacto@servineo.com", 
        photo: "", 
        whatsapp: "59100000000" 
      } as Fixer;
    }
  }

  if (!fixer) notFound();

  return <FixerProfileContent fixer={fixer} />;
}