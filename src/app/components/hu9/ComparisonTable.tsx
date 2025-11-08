"use client";

import { useMemo } from "react";
import styles from "../../styles/hu9/ComparisonTable.module.css";

export type ComparisonRow = {
  criterion: string;
  servineo: string | { text: string; icon?: "check" | "cross" };
  facebookMarketplace: string | { text: string; icon?: "check" | "cross" };
  booka: string | { text: string; icon?: "check" | "cross" };
};

export type ComparisonTableProps = {
  title?: string;
  subtitle?: string;
  data?: ComparisonRow[];
};

// Datos por defecto del cuadro comparativo
const DEFAULT_DATA: ComparisonRow[] = [
  {
    criterion: "Enfoque",
    servineo: "🛠️ Servicios especializados",
    facebookMarketplace: "📦 Compra/venta de productos",
    booka: "💼 Servicios profesionales",
  },
  {
    criterion: "Verificación de usuarios",
    servineo: { text: "Perfiles verificados", icon: "check" },
    facebookMarketplace: { text: "Sin verificación obligatoria", icon: "cross" },
    booka: { text: "Requiere registro básico", icon: "check" },
  },
  {
    criterion: "Comunicación",
    servineo: "💬 Chat interno/WhatsApp",
    facebookMarketplace: "💬 Messenger libre",
    booka: "📱 Comunicación dentro de la app",
  },
  {
    criterion: "Seguridad",
    servineo: "🔒 Comentarios y valoraciones",
    facebookMarketplace: "⚠️ Riesgo de estafas",
    booka: "🔒 Moderadamente segura",
  },
  {
    criterion: "Diseño",
    servineo: "🎨 Intuitivo, moderno, local",
    facebookMarketplace: "🖥️ Simple, no especializado",
    booka: "🖥️ Interfaz profesional",
  },
  {
    criterion: "Disponibilidad",
    servineo: "🌍 Mercado local boliviano",
    facebookMarketplace: "🌎 Internacional sin filtros",
    booka: "🌍 Enfocada en países específicos",
  },
  {
    criterion: "Ventajas",
    servineo: "⚡ Conexión rápida, soporte directo",
    facebookMarketplace: "🌐 Gran visibilidad global",
    booka: "🔧 Variedad de servicios",
  },
  {
    criterion: "Desventajas",
    servineo: "🔧 Aún en desarrollo",
    facebookMarketplace: "⚠️ Poca seguridad sobre los servicios",
    booka: "⚠️ Poco control sobre los servicios",
  },
];

export default function ComparisonTable({
  title = "¿Por qué elegir Servineo?",
  subtitle = "Compara Servineo con otras plataformas y descubre las ventajas",
  data = DEFAULT_DATA,
}: ComparisonTableProps) {
  const comparisonData = useMemo(() => data, [data]);

  return (
    <section className={styles.container} aria-labelledby="comparison-title">
      <div className={styles.header}>
        <h2 id="comparison-title" className={styles.title}>
          {title}
        </h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table} role="table">
          <thead>
            <tr>
              <th className={styles.criterionHeader} scope="col">
                Criterio
              </th>
              <th className={`${styles.columnHeader} ${styles.servineoHeader}`} scope="col">
                Servineo
              </th>
              <th className={styles.columnHeader} scope="col">
                Facebook Marketplace
              </th>
              <th className={styles.columnHeader} scope="col">
                Booka
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => {
              const renderCell = (value: string | { text: string; icon?: "check" | "cross" }) => {
                if (typeof value === "string") {
                  return <span className={styles.cellContent}>{value}</span>;
                }
                return (
                  <div className={styles.cellWithIcon}>
                    {value.icon === "check" && (
                      <span className={styles.checkIcon} aria-label="Sí">✓</span>
                    )}
                    {value.icon === "cross" && (
                      <span className={styles.crossIcon} aria-label="No">✗</span>
                    )}
                    <span className={styles.cellContent}>{value.text}</span>
                  </div>
                );
              };

              return (
                <tr key={index} className={styles.row}>
                  <td className={styles.criterionCell}>
                    <span className={styles.criterionText}>{row.criterion}</span>
                  </td>
                  <td className={`${styles.cell} ${styles.servineoCell}`}>
                    {renderCell(row.servineo)}
                  </td>
                  <td className={styles.cell}>
                    {renderCell(row.facebookMarketplace)}
                  </td>
                  <td className={styles.cell}>
                    {renderCell(row.booka)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Versión mobile-friendly con cards */}
      <div className={styles.mobileView}>
        {comparisonData.map((row, index) => (
          <div key={index} className={styles.mobileCard}>
            <h3 className={styles.mobileCriterion}>{row.criterion}</h3>
            <div className={styles.mobileColumns}>
              <div className={styles.mobileColumn}>
                <div className={styles.mobileLabel}>Servineo</div>
                <div className={`${styles.mobileValue} ${styles.servineoValue}`}>
                  {typeof row.servineo === "string" ? row.servineo : row.servineo.text}
                </div>
              </div>
              <div className={styles.mobileColumn}>
                <div className={styles.mobileLabel}>Facebook Marketplace</div>
                <div className={styles.mobileValue}>
                  {typeof row.facebookMarketplace === "string" 
                    ? row.facebookMarketplace 
                    : row.facebookMarketplace.text}
                </div>
              </div>
              <div className={styles.mobileColumn}>
                <div className={styles.mobileLabel}>Booka</div>
                <div className={styles.mobileValue}>
                  {typeof row.booka === "string" ? row.booka : row.booka.text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

