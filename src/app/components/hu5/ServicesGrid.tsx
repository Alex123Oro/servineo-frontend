"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/hu5/ServicesGrid.module.css";
import Image from 'next/image';
type Service = {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  active: boolean;
};

// Mock local (>=10). Puedes conectarlo a API después.
const MOCK: Service[] = [
  { id: "1",  name: "Albañilería general",       category: "Albañilería",  imageUrl: "/img/services/Albañileriageneral.png", active: true },
  { id: "2",  name: "Carpintería fina",          category: "Carpintería",  imageUrl: "/img/services/Carpinteriafina.png", active: true },
  { id: "3",  name: "Electricidad domiciliaria", category: "Electricidad",  imageUrl: "/img/services/Electricidaddomiciliaria.png", active: true },
  { id: "4",  name: "Limpieza de oficinas",      category: "Limpieza",      imageUrl: "/img/services/Limpiezadeoficinas.png", active: true },
  { id: "5",  name: "Limpieza profunda",         category: "Limpieza",      imageUrl: "/img/services/Limpiezaprofunda.png", active: true },
  { id: "6",  name: "Muebles a medida",          category: "Carpintería",   imageUrl: "/img/services/Mueblesamedida.png", active: true },
  { id: "7",  name: "Pintura exterior",          category: "Pintura",       imageUrl: "/img/services/Pinturaexterior.png", active: true },
  { id: "8",  name: "Pintura interior",          category: "Pintura",       imageUrl: "/img/services/Pinturainterior.png", active: true },
  { id: "9",  name: "Plomería residencial",      category: "Plomería",      imageUrl: "/img/services/Plomeríaresidencial.png", active: true },
  { id: "10", name: "Instalación de grifería",   category: "Plomería",      imageUrl: "/img/services/Instalacióndegrifería.png", active: true },
  { id: "11", name: "Revoque y enlucido",        category: "Albañilería",   imageUrl: "/img/services/Revoqueyenlucido.png", active: true },
  { id: "12", name: "Cableado estructurado",     category: "Electricidad",  imageUrl: "/img/services/Cableadoestructurado.png", active: true }
];

// Mapeo de categorías de HU-05 a categorías de HU-04
const categoryMapping: { [key: string]: string } = {
  "Carpintería": "carpinteria",
  "Plomería": "plomeria",
  "Limpieza": "aseo",
  "Pintura": "pintura",
  "Electricidad": "electricidad",
  "Albañilería": "albañilería"
};

export default function ServicesGrid({ pageSize = 12 }: { pageSize?: number }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [visible, setVisible] = useState(pageSize);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // "Carga" simulada
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const t = setTimeout(() => {
      if (!mounted) return;
      try {
        setServices(MOCK);
      } catch {
        setError("No fue posible cargar los servicios.");
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => { mounted = false; clearTimeout(t); };
  }, []);

  // Sólo activos
  const active = useMemo(() => services.filter(s => s.active), [services]);

  // Orden alfabético (ES)
  const ordered = useMemo(
    () => [...active].sort((a, b) => a.name.localeCompare(b.name, "es")),
    [active]
  );

  // Búsqueda + filtro
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ordered.filter(s => {
      const matchQ = !q || `${s.name} ${s.category}`.toLowerCase().includes(q);
      const matchCat = category === "Todas" || s.category === category;
      return matchQ && matchCat;
    });
  }, [ordered, query, category]);

  // Categorías dinámicas
  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(active.map(s => s.category)))],
    [active]
  );

  // Mantener scroll al volver
 useEffect(() => {
    const key = "hu5-services-scroll";
    const saved = sessionStorage.getItem(key);
    const currentRef = listRef.current; // Guardar referencia
    if (saved && currentRef) currentRef.scrollTo({ top: parseInt(saved, 10) });
    return () => { 
      if (currentRef) sessionStorage.setItem(key, String(currentRef.scrollTop)); 
    };
  }, []);
  const slice = filtered.slice(0, visible);
  const canLoadMore = filtered.length > visible;

  // Función para manejar el click en un servicio
  const handleServiceClick = (service: Service) => {
    // Obtener la categoría mapeada para HU-04
    const mappedCategory = categoryMapping[service.category] || service.category.toLowerCase();
    
    // Redirigir a la página de trabajos recientes con el filtro de categoría
    router.push(`/trabajos-recientes?categoria=${mappedCategory}`);
  };

  return (
    <section aria-labelledby="services-title" className={styles.container}>
      <h2 id="services-title" className={styles.title}>Nuestros Servicios</h2>
      
      <div className={styles.filters}>
        <input
          type="search"
          aria-label="Buscar servicios"
          placeholder="Buscar (ej., plomería)..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisible(pageSize); }}
          className={styles.input}
        />
        <select
          aria-label="Filtrar por categoría"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setVisible(pageSize); }}
          className={styles.select}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div ref={listRef} className={styles.grid} aria-live="polite" aria-busy={loading}>
        {loading && <p className={styles.full}>Cargando servicios...</p>}
        {!loading && error && (
          <div className={styles.alert} role="alert">
            {error} <button className={styles.link} onClick={() => location.reload()}>Reintentar</button>
          </div>
        )}
        {!loading && !error && slice.length === 0 && (
          <p className={styles.full}>No hay servicios disponibles.</p>
        )}
        {!loading && !error && slice.map(s => (
          <article
            key={s.id}
            tabIndex={0}
            role="button"
            onClick={() => handleServiceClick(s)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleServiceClick(s)}
            className={styles.card}
            aria-label={`Servicio: ${s.name}`}
            title={s.name}
          >
            <div className={styles.imgbox}>
              {s.imageUrl ? (
                <Image
                  src={s.imageUrl}
                  alt={`Imagen de ${s.name}`}
                  width={300}
                  height={200}
                  className={styles.img}
                  onError={(e) => { 
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className={styles.placeholderIcon} aria-hidden="true">🔧</div>
              )}
            </div>
            <div className={styles.cat}>{s.category}</div>
            <h3 className={styles.name}>{s.name}</h3>
          </article>
        ))}
      </div>

      {!loading && !error && canLoadMore && (
        <div className={styles.center}>
          <button
            className={styles.btn}
            onClick={() => setVisible(v => v + pageSize)}
            aria-label="Cargar más servicios"
          >
            Ver más
          </button>
        </div>
      )}
    </section>
  );
}