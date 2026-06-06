import { Lock, FileText, User, ArrowRight, Shield } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface VersionEntry {
  id: number;
  date: string;
  time: string;
  user: string;
  userRole: string;
  procedureCode: string;
  procedureName: string;
  field: string;
  previousValue: string;
  newValue: string;
  resolucion: string;
}

// ── Static data ───────────────────────────────────────────────────────────────
const HISTORY: VersionEntry[] = [
  {
    id: 1,
    date: "06/06/2026",
    time: "14:32",
    user: "Carlos Mamani R.",
    userRole: "Administrador",
    procedureCode: "PA-001",
    procedureName: "Certificado de Estudios",
    field: "Costo (S/)",
    previousValue: "S/ 40.00",
    newValue: "S/ 50.00",
    resolucion: "R.R. 00234-2026-UNSAAC",
  },
  {
    id: 2,
    date: "28/05/2026",
    time: "09:15",
    user: "Carlos Mamani R.",
    userRole: "Administrador",
    procedureCode: "PA-004",
    procedureName: "Grado de Bachiller",
    field: "Plazo (días)",
    previousValue: "45 días",
    newValue: "30 días",
    resolucion: "R.R. 00198-2026-UNSAAC",
  },
  {
    id: 3,
    date: "15/05/2026",
    time: "11:47",
    user: "Sara Quispe Lima",
    userRole: "Administrador",
    procedureCode: "PA-003",
    procedureName: "Carné Universitario",
    field: "Oficina responsable",
    previousValue: "Secretaría General",
    newValue: "Bienestar Universitario",
    resolucion: "R.R. 00167-2026-UNSAAC",
  },
  {
    id: 4,
    date: "03/05/2026",
    time: "16:20",
    user: "Carlos Mamani R.",
    userRole: "Administrador",
    procedureCode: "PA-005",
    procedureName: "Título Profesional",
    field: "Costo (S/)",
    previousValue: "S/ 420.00",
    newValue: "S/ 480.00",
    resolucion: "R.R. 00145-2026-UNSAAC",
  },
  {
    id: 5,
    date: "12/04/2026",
    time: "08:55",
    user: "Sara Quispe Lima",
    userRole: "Administrador",
    procedureCode: "PA-006",
    procedureName: "Duplicado de Diploma",
    field: "Estado",
    previousValue: "Activo",
    newValue: "Inactivo",
    resolucion: "R.R. 00089-2026-UNSAAC",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function VersionHistory() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--unsaac-gray-page)", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid var(--unsaac-gray-border)",
        padding: "20px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "var(--radius-md)",
            backgroundColor: "#2B2B2B",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Lock size={18} color="var(--unsaac-gold)" />
          </div>
          <div>
            <h1 style={{ margin: 0 }}>Historial de Versiones</h1>
            <p style={{ margin: 0, fontSize: "var(--font-size-body-small)", color: "var(--unsaac-text-secondary)" }}>
              Registro de modificaciones al Catálogo TUPA
            </p>
          </div>
        </div>

        {/* Immutability banner */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#2B2B2B",
          borderRadius: "var(--radius-md)",
          padding: "8px 16px",
        }}>
          <Lock size={14} color="var(--unsaac-gold)" />
          <span style={{
            fontSize: "var(--font-size-body-small)",
            color: "#fff",
            fontWeight: 600,
          }}>
            Historial inmutable — no puede ser modificado
          </span>
          <span style={{
            fontSize: "var(--font-size-caption)",
            color: "var(--unsaac-gold)",
            fontWeight: 600,
          }}>
            (RN-29)
          </span>
        </div>
      </div>

      <div style={{ padding: "32px 32px", display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Timeline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0" }}>
          {HISTORY.map((entry, index) => (
            <div key={entry.id} style={{ display: "flex", gap: "0", position: "relative" }}>
              {/* Timeline spine */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
                <div style={{
                  width: "16px", height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "var(--unsaac-red)",
                  border: "3px solid #fff",
                  boxShadow: "0 0 0 2px var(--unsaac-red)",
                  zIndex: 1,
                  marginTop: "20px",
                  flexShrink: 0,
                }} />
                {index < HISTORY.length - 1 && (
                  <div style={{
                    width: "2px",
                    flex: 1,
                    minHeight: "40px",
                    backgroundColor: "#E5E7EB",
                  }} />
                )}
              </div>

              {/* Card */}
              <div style={{
                flex: 1,
                backgroundColor: "#fff",
                border: "1px solid var(--unsaac-gray-border)",
                borderRadius: "var(--card-radius)",
                marginBottom: index < HISTORY.length - 1 ? "16px" : 0,
                overflow: "hidden",
              }}>
                {/* Card header */}
                <div style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--unsaac-gray-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px",
                  backgroundColor: "#FAFAFA",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Datetime */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "var(--font-size-body-small)", fontWeight: 600, color: "var(--unsaac-text-primary)" }}>
                        {entry.date}
                      </span>
                      <span style={{ fontSize: "var(--font-size-caption)", color: "var(--unsaac-text-secondary)" }}>
                        {entry.time} hrs
                      </span>
                    </div>

                    {/* Divider */}
                    <div style={{ width: "1px", height: "32px", backgroundColor: "var(--unsaac-gray-border)" }} />

                    {/* User */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        backgroundColor: "#2B2B2B",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <User size={13} color="var(--unsaac-gold)" />
                      </div>
                      <div>
                        <div style={{ fontSize: "var(--font-size-body-small)", fontWeight: 600, color: "var(--unsaac-text-primary)" }}>
                          {entry.user}
                        </div>
                        <div style={{ fontSize: "var(--font-size-caption)", color: "var(--unsaac-text-secondary)" }}>
                          {entry.userRole}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resolución */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    backgroundColor: "#FFFBEB",
                    border: "1px solid #FCD34D",
                    borderRadius: "var(--radius-pill)",
                    padding: "4px 12px",
                  }}>
                    <FileText size={12} color="#D97706" />
                    <span style={{ fontSize: "var(--font-size-caption)", fontWeight: 600, color: "#92400E" }}>
                      {entry.resolucion}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Procedure */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      fontFamily: "monospace",
                      fontSize: "var(--font-size-caption)",
                      backgroundColor: "#FEE2E2",
                      color: "var(--unsaac-red)",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: 700,
                    }}>
                      {entry.procedureCode}
                    </span>
                    <span style={{ fontSize: "var(--font-size-body-small)", color: "var(--unsaac-text-primary)", fontWeight: 500 }}>
                      {entry.procedureName}
                    </span>
                  </div>

                  {/* Change detail */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--unsaac-gray-border)",
                    flexWrap: "wrap",
                  }}>
                    <span style={{
                      fontSize: "var(--font-size-caption)",
                      fontWeight: 600,
                      color: "var(--unsaac-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      minWidth: "120px",
                    }}>
                      {entry.field}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, flexWrap: "wrap" }}>
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "#FEE2E2",
                        color: "#991B1B",
                        fontSize: "var(--font-size-body-small)",
                        fontWeight: 600,
                        textDecoration: "line-through",
                      }}>
                        {entry.previousValue}
                      </span>
                      <ArrowRight size={14} color="var(--unsaac-text-secondary)" style={{ flexShrink: 0 }} />
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "#D1FAE5",
                        color: "#065F46",
                        fontSize: "var(--font-size-body-small)",
                        fontWeight: 600,
                      }}>
                        {entry.newValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar info panel */}
        <div style={{
          width: "260px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          position: "sticky",
          top: "24px",
        }}>
          {/* Stats card */}
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid var(--unsaac-gray-border)",
            borderRadius: "var(--card-radius)",
            padding: "20px",
          }}>
            <h4 style={{ margin: "0 0 14px", color: "var(--unsaac-text-primary)" }}>Resumen</h4>
            {[
              { label: "Total de cambios", value: "5" },
              { label: "Procedimientos modificados", value: "5" },
              { label: "Resoluciones citadas", value: "5" },
              { label: "Último cambio", value: "06/06/2026" },
            ].map((stat) => (
              <div key={stat.label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid var(--unsaac-gray-border)",
              }}>
                <span style={{ fontSize: "var(--font-size-caption)", color: "var(--unsaac-text-secondary)" }}>
                  {stat.label}
                </span>
                <span style={{ fontSize: "var(--font-size-body-small)", fontWeight: 600, color: "var(--unsaac-text-primary)" }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Legal notice */}
          <div style={{
            backgroundColor: "#2B2B2B",
            border: "1px solid #3D3D3D",
            borderRadius: "var(--card-radius)",
            padding: "16px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Shield size={15} color="var(--unsaac-gold)" />
              <span style={{ color: "var(--unsaac-gold)", fontSize: "var(--font-size-body-small)", fontWeight: 700 }}>
                Norma RN-29
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "var(--font-size-caption)", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              El historial de versiones es un registro de auditoría inmutable. Ningún
              administrador puede editar, eliminar ni reordenar las entradas de este registro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
