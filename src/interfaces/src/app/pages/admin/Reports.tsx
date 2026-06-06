import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader,
  Download,
  FileSpreadsheet,
  Calendar,
  ChevronDown,
  Lock,
  BarChart2,
  TrendingUp,
} from "lucide-react";

// ── Role simulation (toggle for demo) ────────────────────────────────────────
type UserRole = "ADMIN" | "JEFE_OFICINA";

// ── Static data ───────────────────────────────────────────────────────────────
const TOP_PROCEDURES = [
  { name: "Certificado de Estudios", value: 45 },
  { name: "Constancia de Matrícula", value: 32 },
  { name: "Carné Universitario", value: 24 },
  { name: "Grado de Bachiller", value: 18 },
  { name: "Título Profesional", value: 8 },
];

const STATUS_DONUT = [
  { name: "Aprobados", value: 82, color: "#059669" },
  { name: "En Revisión", value: 18, color: "#1E40AF" },
  { name: "Observados", value: 9, color: "#D97706" },
  { name: "Rechazados", value: 6, color: "#DC2626" },
  { name: "Vencidos", value: 8, color: "#7F1D1D" },
];

const WEEKLY_DATA = [
  { semana: "S1 Mayo", tramites: 28 },
  { semana: "S2 Mayo", tramites: 35 },
  { semana: "S3 Mayo", tramites: 42 },
  { semana: "S4 Mayo", tramites: 22 },
];

const OFFICE_PERFORMANCE = [
  {
    oficina: "Registro Académico",
    recibidos: 54,
    aprobados: 42,
    observados: 7,
    rechazados: 3,
    vencidos: 2,
    cumplimiento: 96.3,
  },
  {
    oficina: "Bienestar Universitario",
    recibidos: 38,
    aprobados: 29,
    observados: 5,
    rechazados: 2,
    vencidos: 4,
    cumplimiento: 89.5,
  },
  {
    oficina: "Tesorería",
    recibidos: 35,
    aprobados: 25,
    observados: 6,
    rechazados: 1,
    vencidos: 2,
    cumplimiento: 94.3,
  },
];

const ALL_OFFICES = [
  "Todas las oficinas",
  "Registro Académico",
  "Bienestar Universitario",
  "Tesorería",
  "Secretaría General",
  "Oficina de Grados y Títulos",
];

const PROCEDURE_TYPES = [
  "Certificado de Estudios",
  "Constancia de Matrícula",
  "Carné Universitario",
  "Grado de Bachiller",
  "Título Profesional",
];

const STATUS_OPTIONS = [
  "Pendiente",
  "En Revisión",
  "Aprobado",
  "Observado",
  "Rechazado",
  "Vencido",
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function PeriodPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: active ? "var(--unsaac-red)" : "var(--unsaac-white)",
        color: active ? "#fff" : "var(--unsaac-text-primary)",
        border: `1px solid ${active ? "var(--unsaac-red)" : "var(--unsaac-gray-border)"}`,
        borderRadius: "var(--radius-pill)",
        padding: "6px 16px",
        fontSize: "var(--font-size-body-small)",
        fontWeight: active ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  bgColor,
  icon,
  iconColor,
}: {
  title: string;
  value: string;
  subtitle?: string;
  bgColor: string;
  icon: React.ReactNode;
  iconColor: string;
}) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: "1px solid var(--unsaac-gray-border)",
        borderRadius: "var(--card-radius)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "var(--font-size-body-small)",
            color: "var(--unsaac-text-secondary)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          {title}
        </span>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--unsaac-text-primary)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {subtitle && (
        <span style={{ fontSize: "var(--font-size-caption)", color: "var(--unsaac-text-secondary)" }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

function GaugeCard({ value }: { value: number }) {
  const isGood = value >= 80;
  const gaugeColor = isGood ? "#059669" : "#DC2626";
  // SVG semicircle gauge
  const radius = 52;
  const cx = 70;
  const cy = 70;
  const startAngle = 180;
  const endAngle = 0;
  const pct = Math.min(value / 100, 1);
  const sweepAngle = 180 * pct;
  const currentAngle = startAngle - sweepAngle;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const trackX1 = cx + radius * Math.cos(rad(startAngle));
  const trackY1 = cy + radius * Math.sin(rad(startAngle));
  const trackX2 = cx + radius * Math.cos(rad(endAngle));
  const trackY2 = cy + radius * Math.sin(rad(endAngle));
  const fillX1 = cx + radius * Math.cos(rad(startAngle));
  const fillY1 = cy + radius * Math.sin(rad(startAngle));
  const fillX2 = cx + radius * Math.cos(rad(currentAngle));
  const fillY2 = cy + radius * Math.sin(rad(currentAngle));
  const largeArc = sweepAngle > 180 ? 1 : 0;

  return (
    <div
      style={{
        backgroundColor: isGood ? "#F0FDF4" : "#FEF2F2",
        border: "1px solid var(--unsaac-gray-border)",
        borderRadius: "var(--card-radius)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontSize: "var(--font-size-body-small)",
          color: "var(--unsaac-text-secondary)",
          fontWeight: "var(--font-weight-medium)",
          alignSelf: "flex-start",
          width: "100%",
        }}
      >
        % Cumplimiento
      </span>
      <svg width="140" height="80" viewBox="0 0 140 80">
        {/* Track */}
        <path
          d={`M ${trackX1} ${trackY1} A ${radius} ${radius} 0 0 1 ${trackX2} ${trackY2}`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Fill */}
        {pct > 0 && (
          <path
            d={`M ${fillX1} ${fillY1} A ${radius} ${radius} 0 ${largeArc} 1 ${fillX2} ${fillY2}`}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="12"
            strokeLinecap="round"
          />
        )}
        {/* Value text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          fill={gaugeColor}
        >
          {value}%
        </text>
      </svg>
      <span
        style={{
          fontSize: "var(--font-size-caption)",
          color: isGood ? "#059669" : "#DC2626",
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        {isGood ? "Dentro de meta ≥ 80%" : "Por debajo de meta"}
      </span>
    </div>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggleOption = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  const displayText =
    selected.length === 0
      ? `Todos (${label})`
      : selected.length === 1
      ? selected[0]
      : `${selected.length} seleccionados`;

  return (
    <div style={{ position: "relative", minWidth: "200px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "8px 12px",
          backgroundColor: "var(--unsaac-white)",
          border: "1px solid var(--unsaac-gray-border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--font-size-body-small)",
          color: "var(--unsaac-text-primary)",
          cursor: "pointer",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayText}
        </span>
        <ChevronDown size={14} color="var(--unsaac-text-secondary)" />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "240px",
            backgroundColor: "var(--unsaac-white)",
            border: "1px solid var(--unsaac-gray-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "var(--font-size-body-small)",
                color: "var(--unsaac-text-primary)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleOption(opt)}
                style={{ accentColor: "var(--unsaac-red)", cursor: "pointer" }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Custom Tooltip for Recharts ──────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        backgroundColor: "var(--unsaac-white)",
        border: "1px solid var(--unsaac-gray-border)",
        borderRadius: "var(--radius-md)",
        padding: "8px 12px",
        fontSize: "var(--font-size-body-small)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <p style={{ color: "var(--unsaac-text-secondary)", marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || "var(--unsaac-text-primary)", fontWeight: 600 }}>
          {p.value} trámites
        </p>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function Reports() {
  const [role, setRole] = useState<UserRole>("ADMIN");
  const [period, setPeriod] = useState<"semana" | "mes" | "trimestre" | "personalizado">("mes");
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedOffice, setSelectedOffice] = useState(ALL_OFFICES[0]);
  const [officeDropdownOpen, setOfficeDropdownOpen] = useState(false);
  const [fromDate, setFromDate] = useState("2026-05-01");
  const [toDate, setToDate] = useState("2026-05-31");
  const [reportGenerated, setReportGenerated] = useState(true);

  const isAdmin = role === "ADMIN";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--unsaac-gray-page)",
        padding: "0 0 40px 0",
      }}
    >
      {/* ── Page Header ── */}
      <div
        style={{
          backgroundColor: "var(--unsaac-white)",
          borderBottom: "1px solid var(--unsaac-gray-border)",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChart2 size={20} color="var(--unsaac-red)" />
          </div>
          <div>
            <h1 style={{ margin: 0 }}>Reportes y Estadísticas</h1>
            <p
              style={{
                margin: 0,
                fontSize: "var(--font-size-body-small)",
                color: "var(--unsaac-text-secondary)",
              }}
            >
              Sistema TUPA — UNSAAC · Periodo: Mayo 2026
            </p>
          </div>
        </div>
        {/* Role toggle (demo) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--unsaac-gray-page)",
            borderRadius: "var(--radius-pill)",
            padding: "4px",
            border: "1px solid var(--unsaac-gray-border)",
          }}
        >
          {(["ADMIN", "JEFE_OFICINA"] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: "4px 12px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                fontSize: "var(--font-size-caption)",
                fontWeight: "var(--font-weight-medium)",
                cursor: "pointer",
                backgroundColor: role === r ? "var(--unsaac-red)" : "transparent",
                color: role === r ? "#fff" : "var(--unsaac-text-secondary)",
                transition: "all 0.15s",
              }}
            >
              {r === "ADMIN" ? "Admin" : "Jefe Oficina"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* ── Filter Panel ── */}
        <div
          style={{
            backgroundColor: "var(--unsaac-white)",
            border: "1px solid var(--unsaac-gray-border)",
            borderRadius: "var(--card-radius)",
            padding: "20px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
            {/* Period pills */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--font-size-caption)",
                  color: "var(--unsaac-text-secondary)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Período
              </label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(["semana", "mes", "trimestre", "personalizado"] as const).map((p) => (
                  <PeriodPill
                    key={p}
                    label={p.charAt(0).toUpperCase() + p.slice(1)}
                    active={period === p}
                    onClick={() => setPeriod(p)}
                  />
                ))}
              </div>
            </div>

            {/* Custom date pickers */}
            {period === "personalizado" && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "var(--font-size-caption)",
                      color: "var(--unsaac-text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    Desde
                  </label>
                  <div style={{ position: "relative" }}>
                    <Calendar
                      size={14}
                      color="var(--unsaac-text-secondary)"
                      style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      style={{
                        paddingLeft: "32px",
                        paddingRight: "12px",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        border: "1px solid var(--unsaac-gray-border)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "var(--font-size-body-small)",
                        backgroundColor: "var(--unsaac-white)",
                        color: "var(--unsaac-text-primary)",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "var(--font-size-caption)",
                      color: "var(--unsaac-text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    Hasta
                  </label>
                  <div style={{ position: "relative" }}>
                    <Calendar
                      size={14}
                      color="var(--unsaac-text-secondary)"
                      style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      style={{
                        paddingLeft: "32px",
                        paddingRight: "12px",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        border: "1px solid var(--unsaac-gray-border)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "var(--font-size-body-small)",
                        backgroundColor: "var(--unsaac-white)",
                        color: "var(--unsaac-text-primary)",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Procedure type multi-select */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--font-size-caption)",
                  color: "var(--unsaac-text-secondary)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Tipo de Procedimiento
              </label>
              <MultiSelect
                label="tipos"
                options={PROCEDURE_TYPES}
                selected={selectedProcedures}
                onChange={setSelectedProcedures}
              />
            </div>

            {/* Status multi-select */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--font-size-caption)",
                  color: "var(--unsaac-text-secondary)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Estado
              </label>
              <MultiSelect
                label="estados"
                options={STATUS_OPTIONS}
                selected={selectedStatuses}
                onChange={setSelectedStatuses}
              />
            </div>

            {/* Office field — editable (ADMIN) or locked (JEFE_OFICINA) */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--font-size-caption)",
                  color: "var(--unsaac-text-secondary)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Oficina
              </label>
              {isAdmin ? (
                <div style={{ position: "relative", minWidth: "220px" }}>
                  <button
                    onClick={() => setOfficeDropdownOpen(!officeDropdownOpen)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      padding: "8px 12px",
                      backgroundColor: "var(--unsaac-white)",
                      border: "1px solid var(--unsaac-gray-border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--font-size-body-small)",
                      color: "var(--unsaac-text-primary)",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedOffice}
                    </span>
                    <ChevronDown size={14} color="var(--unsaac-text-secondary)" />
                  </button>
                  {officeDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        width: "100%",
                        backgroundColor: "var(--unsaac-white)",
                        border: "1px solid var(--unsaac-gray-border)",
                        borderRadius: "var(--radius-md)",
                        boxShadow: "var(--shadow-md)",
                        zIndex: 50,
                        overflow: "hidden",
                      }}
                    >
                      {ALL_OFFICES.map((office) => (
                        <button
                          key={office}
                          onClick={() => {
                            setSelectedOffice(office);
                            setOfficeDropdownOpen(false);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "8px 12px",
                            border: "none",
                            backgroundColor:
                              selectedOffice === office ? "#FEE2E2" : "transparent",
                            color: "var(--unsaac-text-primary)",
                            fontSize: "var(--font-size-body-small)",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor =
                              selectedOffice === office ? "#FEE2E2" : "transparent")
                          }
                        >
                          {office}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Locked field for JEFE_OFICINA */
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    backgroundColor: "var(--input-bg-locked)",
                    border: "1px solid var(--unsaac-gray-border)",
                    borderRadius: "var(--radius-md)",
                    minWidth: "260px",
                    cursor: "not-allowed",
                  }}
                >
                  <Lock size={14} color="var(--unsaac-text-secondary)" />
                  <span
                    style={{
                      fontSize: "var(--font-size-body-small)",
                      color: "var(--unsaac-text-secondary)",
                    }}
                  >
                    Oficina de Registro{" "}
                    <span
                      style={{
                        fontSize: "var(--font-size-caption)",
                        color: "#6B7280",
                        fontStyle: "italic",
                      }}
                    >
                      (tu unidad)
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Spacer */}
            <div style={{ marginLeft: "auto" }}>
              <button
                onClick={() => setReportGenerated(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 24px",
                  backgroundColor: "var(--unsaac-red)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-body-small)",
                  fontWeight: "var(--font-weight-semibold)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 1px 4px rgba(139,30,30,0.25)",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "var(--unsaac-red-hover)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--unsaac-red)")
                }
              >
                <TrendingUp size={16} />
                Generar Reporte
              </button>
            </div>
          </div>
        </div>

        {/* ── Empty State ── */}
        {!reportGenerated && (
          <div
            style={{
              backgroundColor: "var(--unsaac-white)",
              border: "1px dashed var(--unsaac-gray-border)",
              borderRadius: "var(--card-radius)",
              padding: "60px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              textAlign: "center",
            }}
          >
            <BarChart2 size={48} color="#D1D5DB" />
            <h3 style={{ margin: 0, color: "var(--unsaac-text-secondary)" }}>
              No hay datos para mostrar
            </h3>
            <p style={{ margin: 0, color: "var(--unsaac-text-secondary)", maxWidth: 440 }}>
              Selecciona un período y haz clic en{" "}
              <strong style={{ color: "var(--unsaac-red)" }}>Generar Reporte</strong> para ver las
              estadísticas. Considera ampliar el rango de fechas si no obtienes resultados.
            </p>
          </div>
        )}

        {/* ── Dashboard Content ── */}
        {reportGenerated && (
          <>
            {/* ── 5 KPI Cards ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "16px",
              }}
            >
              <KpiCard
                title="Trámites atendidos"
                value="127"
                subtitle="En el período seleccionado"
                bgColor="#EFF6FF"
                icon={<FileText size={20} />}
                iconColor="#1E40AF"
              />
              <KpiCard
                title="Tiempo promedio"
                value="3.2 días"
                subtitle="Días hábiles por trámite"
                bgColor="#FFFBEB"
                icon={<Clock size={20} />}
                iconColor="var(--unsaac-gold)"
              />
              <KpiCard
                title="Trámites vencidos"
                value="8"
                subtitle="Requieren atención urgente"
                bgColor="#FEF2F2"
                icon={<AlertTriangle size={20} />}
                iconColor="#DC2626"
              />
              <GaugeCard value={93.7} />
              <KpiCard
                title="Pendientes"
                value="12"
                subtitle="En espera de atención"
                bgColor="#F9FAFB"
                icon={<Loader size={20} />}
                iconColor="#6B7280"
              />
            </div>

            {/* ── Charts Row 1: Bar + Donut ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* Bar chart — Top 5 */}
              <div
                style={{
                  backgroundColor: "var(--unsaac-white)",
                  border: "1px solid var(--unsaac-gray-border)",
                  borderRadius: "var(--card-radius)",
                  padding: "20px 24px",
                }}
              >
                <h3 style={{ margin: "0 0 4px 0" }}>Top 5 Procedimientos</h3>
                <p
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "var(--font-size-caption)",
                    color: "var(--unsaac-text-secondary)",
                  }}
                >
                  Por cantidad de solicitudes en el período
                </p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={TOP_PROCEDURES}
                    layout="vertical"
                    margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={150}
                      tick={{ fontSize: 11, fill: "#374151" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "#FEF2F2" }}
                    />
                    <Bar dataKey="value" fill="#8B1E1E" radius={[0, 4, 4, 0]} barSize={22}>
                      {TOP_PROCEDURES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#8B1E1E" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Donut chart — Status */}
              <div
                style={{
                  backgroundColor: "var(--unsaac-white)",
                  border: "1px solid var(--unsaac-gray-border)",
                  borderRadius: "var(--card-radius)",
                  padding: "20px 24px",
                }}
              >
                <h3 style={{ margin: "0 0 4px 0" }}>Distribución por Estado</h3>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "var(--font-size-caption)",
                    color: "var(--unsaac-text-secondary)",
                  }}
                >
                  Total: {STATUS_DONUT.reduce((a, b) => a + b.value, 0)} expedientes
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={STATUS_DONUT}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {STATUS_DONUT.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value} trámites`, ""]}
                        contentStyle={{
                          backgroundColor: "var(--unsaac-white)",
                          border: "1px solid var(--unsaac-gray-border)",
                          borderRadius: "var(--radius-md)",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                    {STATUS_DONUT.map((entry) => (
                      <div
                        key={entry.name}
                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "2px",
                            backgroundColor: entry.color,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "var(--font-size-caption)",
                            color: "var(--unsaac-text-secondary)",
                            flex: 1,
                          }}
                        >
                          {entry.name}
                        </span>
                        <span
                          style={{
                            fontSize: "var(--font-size-caption)",
                            fontWeight: "var(--font-weight-semibold)",
                            color: "var(--unsaac-text-primary)",
                          }}
                        >
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Line Chart — Full Width ── */}
            <div
              style={{
                backgroundColor: "var(--unsaac-white)",
                border: "1px solid var(--unsaac-gray-border)",
                borderRadius: "var(--card-radius)",
                padding: "20px 24px",
              }}
            >
              <h3 style={{ margin: "0 0 4px 0" }}>Trámites por Semana</h3>
              <p
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "var(--font-size-caption)",
                  color: "var(--unsaac-text-secondary)",
                }}
              >
                Evolución semanal de solicitudes recibidas
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={WEEKLY_DATA}
                  margin={{ top: 8, right: 32, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis
                    dataKey="semana"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="tramites"
                    stroke="#8B1E1E"
                    strokeWidth={2.5}
                    dot={{ fill: "#8B1E1E", r: 5, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7, fill: "#8B1E1E", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ── Performance Table (ADMIN only) ── */}
            {isAdmin && (
              <div
                style={{
                  backgroundColor: "var(--unsaac-white)",
                  border: "1px solid var(--unsaac-gray-border)",
                  borderRadius: "var(--card-radius)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 24px",
                    borderBottom: "1px solid var(--unsaac-gray-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CheckCircle size={18} color="var(--unsaac-red)" />
                  <h3 style={{ margin: 0 }}>Desempeño por Oficina</h3>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "var(--font-size-caption)",
                      color: "var(--unsaac-text-secondary)",
                      backgroundColor: "var(--unsaac-gray-page)",
                      padding: "2px 10px",
                      borderRadius: "var(--radius-pill)",
                      border: "1px solid var(--unsaac-gray-border)",
                    }}
                  >
                    Solo visible para Administrador
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "var(--font-size-body-small)",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        {[
                          "Oficina",
                          "Recibidos",
                          "Aprobados",
                          "Observados",
                          "Rechazados",
                          "Vencidos",
                          "% Cumplimiento",
                        ].map((col) => (
                          <th
                            key={col}
                            style={{
                              padding: "12px 16px",
                              textAlign: col === "Oficina" ? "left" : "center",
                              fontWeight: "var(--font-weight-semibold)",
                              color: "var(--unsaac-text-secondary)",
                              fontSize: "var(--font-size-caption)",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              borderBottom: "1px solid var(--unsaac-gray-border)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {OFFICE_PERFORMANCE.map((row, i) => (
                        <tr
                          key={row.oficina}
                          style={{
                            borderBottom:
                              i < OFFICE_PERFORMANCE.length - 1
                                ? "1px solid var(--unsaac-gray-border)"
                                : "none",
                          }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                          }
                        >
                          <td
                            style={{
                              padding: "14px 16px",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--unsaac-text-primary)",
                            }}
                          >
                            {row.oficina}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center", color: "#1E40AF", fontWeight: 600 }}>
                            {row.recibidos}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center", color: "#059669", fontWeight: 600 }}>
                            {row.aprobados}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center", color: "#D97706", fontWeight: 600 }}>
                            {row.observados}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center", color: "#DC2626", fontWeight: 600 }}>
                            {row.rechazados}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "#7F1D1D",
                                fontWeight: 600,
                              }}
                            >
                              <AlertTriangle size={13} />
                              {row.vencidos}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "3px 10px",
                                borderRadius: "var(--radius-pill)",
                                backgroundColor:
                                  row.cumplimiento >= 90 ? "#D1FAE5" : "#FEF3C7",
                                color: row.cumplimiento >= 90 ? "#065F46" : "#92400E",
                                fontWeight: "var(--font-weight-semibold)",
                                fontSize: "var(--font-size-caption)",
                              }}
                            >
                              {row.cumplimiento}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Export Buttons ── */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 28px",
                  backgroundColor: "var(--unsaac-gold)",
                  color: "#2B2B2B",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-body-small)",
                  fontWeight: "var(--font-weight-semibold)",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(212,160,23,0.3)",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "var(--unsaac-gold-hover)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--unsaac-gold)")
                }
              >
                <Download size={16} />
                Exportar PDF
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 28px",
                  backgroundColor: "var(--unsaac-gold)",
                  color: "#2B2B2B",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-body-small)",
                  fontWeight: "var(--font-weight-semibold)",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(212,160,23,0.3)",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "var(--unsaac-gold-hover)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--unsaac-gold)")
                }
              >
                <FileSpreadsheet size={16} />
                Exportar Excel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
