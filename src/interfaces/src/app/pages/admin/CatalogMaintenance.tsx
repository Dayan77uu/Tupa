import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  AlertTriangle,
  X,
  ChevronDown,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Procedure {
  id: number;
  code: string;
  name: string;
  cost: number;
  deadline: number;
  office: string;
  active: boolean;
  activeExpedients: number;
}

// ── Static data ───────────────────────────────────────────────────────────────
const OFFICES = [
  "Secretaría General",
  "Registro Académico",
  "Bienestar Universitario",
  "Grados y Títulos",
  "Tesorería",
  "Oficina de Cómputo",
];

const INITIAL_PROCEDURES: Procedure[] = [
  { id: 1, code: "PA-001", name: "Certificado de Estudios", cost: 50, deadline: 5, office: "Registro Académico", active: true, activeExpedients: 8 },
  { id: 2, code: "PA-002", name: "Constancia de Matrícula", cost: 0, deadline: 3, office: "Registro Académico", active: true, activeExpedients: 0 },
  { id: 3, code: "PA-003", name: "Carné Universitario", cost: 25, deadline: 7, office: "Bienestar Universitario", active: true, activeExpedients: 2 },
  { id: 4, code: "PA-004", name: "Grado de Bachiller", cost: 350, deadline: 30, office: "Grados y Títulos", active: true, activeExpedients: 15 },
  { id: 5, code: "PA-005", name: "Título Profesional", cost: 480, deadline: 45, office: "Grados y Títulos", active: true, activeExpedients: 5 },
  { id: 6, code: "PA-006", name: "Duplicado de Diploma", cost: 200, deadline: 20, office: "Secretaría General", active: false, activeExpedients: 0 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const S = {
  card: {
    backgroundColor: "var(--card-bg, #fff)",
    border: "1px solid var(--unsaac-gray-border)",
    borderRadius: "var(--card-radius)",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: "var(--font-size-label)",
    fontWeight: "var(--font-weight-medium)" as any,
    color: "var(--unsaac-text-primary)",
    marginBottom: "6px",
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid var(--unsaac-gray-border)",
    borderRadius: "var(--radius-md)",
    fontSize: "var(--font-size-body-small)",
    backgroundColor: "#fff",
    color: "var(--unsaac-text-primary)",
    outline: "none",
  } as React.CSSProperties,
  inputGold: {
    width: "100%",
    padding: "8px 12px",
    border: "2px solid var(--unsaac-gold)",
    borderRadius: "var(--radius-md)",
    fontSize: "var(--font-size-body-small)",
    backgroundColor: "#fff",
    color: "var(--unsaac-text-primary)",
    outline: "none",
  } as React.CSSProperties,
};

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "99px",
        fontSize: "var(--font-size-caption)",
        fontWeight: 600,
        backgroundColor: active ? "var(--status-approved-bg)" : "var(--status-pending-bg)",
        color: active ? "var(--status-approved-text)" : "var(--status-pending-text)",
        border: `1px solid ${active ? "var(--status-approved-border)" : "var(--status-pending-border)"}`,
      }}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      title={checked ? "Desactivar" : "Activar"}
      style={{
        width: "40px",
        height: "22px",
        borderRadius: "99px",
        border: "none",
        cursor: "pointer",
        backgroundColor: checked ? "var(--unsaac-red)" : "#D1D5DB",
        position: "relative",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "21px" : "3px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

// ── Modal Editar ─────────────────────────────────────────────────────────────
function EditModal({
  procedure,
  onClose,
  onSave,
}: {
  procedure: Procedure;
  onClose: () => void;
  onSave: (updated: Procedure & { resolucion: string }) => void;
}) {
  const [name, setName] = useState(procedure.name);
  const [cost, setCost] = useState(String(procedure.cost));
  const [deadline, setDeadline] = useState(String(procedure.deadline));
  const [office, setOffice] = useState(procedure.office);
  const [active, setActive] = useState(procedure.active);
  const [resolucion, setResolucion] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [officeOpen, setOfficeOpen] = useState(false);

  const hasActiveExpedients = procedure.activeExpedients > 0;
  const canSave = resolucion.trim() !== "" && (!hasActiveExpedients || confirmed);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "var(--card-radius)",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--unsaac-gray-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>Editar Procedimiento</h3>
            <p style={{ margin: 0, fontSize: "var(--font-size-caption)", color: "var(--unsaac-text-secondary)" }}>
              {procedure.code}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "var(--unsaac-text-secondary)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Warning banner — active expedients */}
          {hasActiveExpedients && (
            <div
              style={{
                backgroundColor: "#FEF3C7",
                border: "1px solid #FCD34D",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: "var(--font-size-body-small)", color: "#92400E" }}>
                  Este procedimiento tiene{" "}
                  <strong>{procedure.activeExpedients} expedientes en proceso</strong>. Los cambios
                  aplican solo a nuevos trámites.
                </p>
              </div>
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "var(--font-size-body-small)", color: "#92400E" }}
              >
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  style={{ accentColor: "#D97706", cursor: "pointer", width: "15px", height: "15px" }}
                />
                Confirmo que entiendo el impacto de este cambio
              </label>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label style={S.label}>Nombre del procedimiento</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={S.input} />
          </div>

          {/* Costo + Plazo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={S.label}>Costo (S/)</label>
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} style={S.input} min="0" />
            </div>
            <div>
              <label style={S.label}>Plazo (días hábiles)</label>
              <input type="number" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={S.input} min="1" />
            </div>
          </div>

          {/* Oficina */}
          <div>
            <label style={S.label}>Oficina responsable</label>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setOfficeOpen(!officeOpen)}
                style={{
                  ...S.input,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>{office}</span>
                <ChevronDown size={14} color="var(--unsaac-text-secondary)" />
              </button>
              {officeOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                  backgroundColor: "#fff", border: "1px solid var(--unsaac-gray-border)",
                  borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)", zIndex: 10,
                }}>
                  {OFFICES.map((o) => (
                    <button
                      key={o}
                      onClick={() => { setOffice(o); setOfficeOpen(false); }}
                      style={{
                        width: "100%", textAlign: "left",
                        padding: "8px 12px", border: "none",
                        backgroundColor: office === o ? "#FEE2E2" : "transparent",
                        color: "var(--unsaac-text-primary)",
                        fontSize: "var(--font-size-body-small)", cursor: "pointer",
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Requisitos */}
          <div>
            <label style={S.label}>Requisitos</label>
            <textarea
              rows={3}
              defaultValue="Solicitud dirigida al Director. DNI vigente. Recibo de pago."
              style={{ ...S.input, resize: "vertical", height: "auto" }}
            />
          </div>

          {/* Estado toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <label style={{ ...S.label, marginBottom: 0 }}>Estado del procedimiento</label>
              <p style={{ margin: "2px 0 0", fontSize: "var(--font-size-caption)", color: "var(--unsaac-text-secondary)" }}>
                {active ? "Visible y disponible para solicitudes" : "No disponible para nuevas solicitudes"}
              </p>
            </div>
            <Toggle checked={active} onChange={setActive} />
          </div>

          {/* ── CAMPO ESPECIAL: N° Resolución Rectoral ── */}
          <div>
            <label
              style={{
                ...S.label,
                color: resolucion.trim() ? "var(--unsaac-text-primary)" : "var(--unsaac-gold-dark, #A07812)",
                marginBottom: "4px",
              }}
            >
              N° Resolución Rectoral{" "}
              <span style={{ color: "var(--unsaac-red)" }}>*</span>
            </label>
            <input
              value={resolucion}
              onChange={(e) => setResolucion(e.target.value)}
              placeholder="Ej. R.R. 00234-2026-UNSAAC"
              style={S.inputGold}
            />
            <div
              style={{
                marginTop: "8px",
                backgroundColor: "#FFFBEB",
                border: "1px solid #FCD34D",
                borderRadius: "var(--radius-md)",
                padding: "10px 12px",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <AlertTriangle size={14} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: "var(--font-size-caption)", color: "#92400E" }}>
                <strong>Obligatorio para trazabilidad normativa (RN-27).</strong> Sin este campo el
                botón Guardar está deshabilitado.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--unsaac-gray-border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              border: "1px solid var(--unsaac-gray-border)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "#fff",
              color: "var(--unsaac-text-primary)",
              fontSize: "var(--font-size-body-small)",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            disabled={!canSave}
            onClick={() => canSave && onSave({ ...procedure, name, cost: Number(cost), deadline: Number(deadline), office, active, resolucion })}
            style={{
              padding: "9px 24px",
              border: "none",
              borderRadius: "var(--radius-md)",
              backgroundColor: canSave ? "var(--unsaac-red)" : "#D1D5DB",
              color: canSave ? "#fff" : "#9CA3AF",
              fontSize: "var(--font-size-body-small)",
              fontWeight: 600,
              cursor: canSave ? "pointer" : "not-allowed",
              transition: "background-color 0.15s",
            }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function CatalogMaintenance() {
  const [procedures, setProcedures] = useState<Procedure[]>(INITIAL_PROCEDURES);
  const [search, setSearch] = useState("");
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState("");

  const filtered = procedures.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: number) => {
    setProcedures((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleSave = (updated: Procedure & { resolucion: string }) => {
    setProcedures((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProcedure(null);
    setSavedBanner(`Procedimiento "${updated.name}" actualizado con R.R. ${updated.resolucion}`);
    setTimeout(() => setSavedBanner(""), 4000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--unsaac-gray-page)", padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid var(--unsaac-gray-border)",
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
      }}>
        <div>
          <h1 style={{ margin: 0 }}>Catálogo TUPA</h1>
          <p style={{ margin: 0, fontSize: "var(--font-size-body-small)", color: "var(--unsaac-text-secondary)" }}>
            Gestión de procedimientos y servicios administrativos
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 20px",
            backgroundColor: "var(--unsaac-red)", color: "#fff",
            border: "none", borderRadius: "var(--radius-md)",
            fontSize: "var(--font-size-body-small)", fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
          Nuevo Procedimiento
        </button>
      </div>

      <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Success banner */}
        {savedBanner && (
          <div style={{
            backgroundColor: "var(--status-approved-bg)",
            border: "1px solid var(--status-approved-border)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            color: "var(--status-approved-text)",
            fontSize: "var(--font-size-body-small)",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            ✓ {savedBanner}
          </div>
        )}

        {/* Search bar */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid var(--unsaac-gray-border)",
          borderRadius: "var(--card-radius)",
          padding: "16px 20px",
        }}>
          <div style={{ position: "relative", maxWidth: "400px" }}>
            <Search size={14} color="var(--unsaac-text-secondary)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código o nombre..."
              style={{ ...S.input, paddingLeft: "32px" }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid var(--unsaac-gray-border)",
          borderRadius: "var(--card-radius)",
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-size-body-small)" }}>
              <thead>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  {["Código", "Nombre del procedimiento", "Costo (S/)", "Plazo (días)", "Oficina", "Estado", "Acciones"].map((col) => (
                    <th key={col} style={{
                      padding: "12px 16px",
                      textAlign: col === "Acciones" || col === "Estado" ? "center" : "left",
                      fontWeight: 600,
                      color: "var(--unsaac-text-secondary)",
                      fontSize: "var(--font-size-caption)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      borderBottom: "1px solid var(--unsaac-gray-border)",
                      whiteSpace: "nowrap",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--unsaac-gray-border)" : "none" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FAFAFA")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", fontFamily: "monospace", color: "var(--unsaac-red)", fontWeight: 600 }}>
                      {p.code}
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: "14px 16px" }}>
                      {p.cost === 0 ? (
                        <span style={{ color: "#059669", fontWeight: 600 }}>Gratuito</span>
                      ) : (
                        <span>S/ {p.cost.toFixed(2)}</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px" }}>{p.deadline} días</td>
                    <td style={{ padding: "14px 16px", color: "var(--unsaac-text-secondary)" }}>{p.office}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <StatusBadge active={p.active} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                        <Toggle checked={p.active} onChange={() => handleToggle(p.id)} />
                        <button
                          onClick={() => setEditingProcedure(p)}
                          title="Editar"
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "30px", height: "30px",
                            border: "1px solid var(--unsaac-gray-border)",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            color: "var(--unsaac-text-secondary)",
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "var(--unsaac-text-secondary)" }}>
                      No se encontraron procedimientos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--unsaac-gray-border)",
            fontSize: "var(--font-size-caption)",
            color: "var(--unsaac-text-secondary)",
            display: "flex", gap: "16px",
          }}>
            <span>{procedures.filter(p => p.active).length} activos</span>
            <span>·</span>
            <span>{procedures.filter(p => !p.active).length} inactivos</span>
            <span>·</span>
            <span>{procedures.length} total</span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProcedure && (
        <EditModal
          procedure={editingProcedure}
          onClose={() => setEditingProcedure(null)}
          onSave={handleSave}
        />
      )}

      {/* New Procedure modal placeholder */}
      {showNewModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setShowNewModal(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "var(--card-radius)",
              padding: "32px",
              width: "480px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Nuevo Procedimiento</h3>
            <p style={{ color: "var(--unsaac-text-secondary)", fontSize: "var(--font-size-body-small)" }}>
              Completa los datos del nuevo procedimiento TUPA.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
              <div><label style={S.label}>Nombre</label><input style={S.input} placeholder="Nombre del procedimiento" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div><label style={S.label}>Costo (S/)</label><input type="number" style={S.input} placeholder="0.00" /></div>
                <div><label style={S.label}>Plazo (días)</label><input type="number" style={S.input} placeholder="5" /></div>
              </div>
              <div>
                <label style={{ ...S.label, color: "var(--unsaac-gold-dark, #A07812)" }}>
                  N° Resolución Rectoral <span style={{ color: "var(--unsaac-red)" }}>*</span>
                </label>
                <input style={S.inputGold} placeholder="R.R. 00000-2026-UNSAAC" />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setShowNewModal(false)} style={{
                padding: "9px 20px", border: "1px solid var(--unsaac-gray-border)",
                borderRadius: "var(--radius-md)", backgroundColor: "#fff",
                fontSize: "var(--font-size-body-small)", cursor: "pointer",
              }}>Cancelar</button>
              <button onClick={() => setShowNewModal(false)} style={{
                padding: "9px 20px", border: "none",
                borderRadius: "var(--radius-md)", backgroundColor: "var(--unsaac-red)",
                color: "#fff", fontSize: "var(--font-size-body-small)", fontWeight: 600, cursor: "pointer",
              }}>Crear Procedimiento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
