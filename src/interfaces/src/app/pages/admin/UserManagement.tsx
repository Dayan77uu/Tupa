import { useState } from "react";
import { UserPlus, Search, Edit2, X, AlertCircle, Info } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type UserRole = "Estudiante" | "Egresado" | "Docente" | "Administrativo" | "Mesa de Partes" | "Personal Oficina" | "Jefe de Oficina" | "Administrador";

interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  office: string;
  active: boolean;
}

// ── Static data ───────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
  "Estudiante":       { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  "Egresado":         { bg: "#EDE9FE", text: "#5B21B6", border: "#C4B5FD" },
  "Docente":          { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  "Administrativo":   { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  "Mesa de Partes":   { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  "Personal Oficina": { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
  "Jefe de Oficina":  { bg: "#FEF3C7", text: "#7C2D12", border: "#FCD34D" },
  "Administrador":    { bg: "#2B2B2B", text: "#D4A017", border: "#D4A017" },
};

const ALL_ROLES: UserRole[] = [
  "Estudiante", "Egresado", "Docente", "Administrativo",
  "Mesa de Partes", "Personal Oficina", "Jefe de Oficina", "Administrador",
];

const OFFICES = [
  "N/A", "Registro Académico", "Bienestar Universitario",
  "Grados y Títulos", "Tesorería", "Secretaría General", "Informática",
];

const INITIAL_USERS: SystemUser[] = [
  { id: 1, name: "Juan Pérez López",       email: "juan.perez@unsaac.edu.pe",       role: "Estudiante",       office: "N/A",                  active: true },
  { id: 2, name: "María García Quispe",    email: "maria.garcia@unsaac.edu.pe",     role: "Egresado",         office: "N/A",                  active: true },
  { id: 3, name: "Carlos Mendoza Ayte",    email: "carlos.mendoza@unsaac.edu.pe",   role: "Docente",          office: "N/A",                  active: true },
  { id: 4, name: "Ana Huanca Torres",      email: "ana.huanca@unsaac.edu.pe",       role: "Personal Oficina", office: "Registro Académico",   active: true },
  { id: 5, name: "Pedro Vargas Quispe",    email: "pedro.vargas@unsaac.edu.pe",     role: "Jefe de Oficina",  office: "Grados y Títulos",     active: true },
  { id: 6, name: "Lucía Flores Mamani",    email: "lucia.flores@unsaac.edu.pe",     role: "Mesa de Partes",   office: "Secretaría General",   active: true },
  { id: 7, name: "Roberto Ccahuana",       email: "roberto.ccahuana@unsaac.edu.pe", role: "Administrativo",   office: "N/A",                  active: false },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid var(--unsaac-gray-border)",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--font-size-body-small)",
  backgroundColor: "#fff",
  color: "var(--unsaac-text-primary)",
  outline: "none",
};

function RoleBadge({ role }: { role: UserRole }) {
  const c = ROLE_COLORS[role];
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "99px",
      fontSize: "var(--font-size-caption)",
      fontWeight: 600,
      backgroundColor: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>
      {role}
    </span>
  );
}

// ── Create / Edit Modal ───────────────────────────────────────────────────────
function UserModal({
  user,
  existingEmails,
  onClose,
  onSave,
}: {
  user: SystemUser | null;
  existingEmails: string[];
  onClose: () => void;
  onSave: (u: Omit<SystemUser, "id">) => void;
}) {
  const isEdit = user !== null;
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<UserRole>(user?.role ?? "Estudiante");
  const [office, setOffice] = useState(user?.office ?? "N/A");
  const [active, setActive] = useState(user?.active ?? true);

  const originalEmail = user?.email ?? "";
  const emailDuplicate =
    email !== originalEmail && existingEmails.includes(email.toLowerCase().trim());
  const roleChanged = isEdit && role !== user?.role;
  const canSave = name.trim() && email.trim() && !emailDuplicate;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "var(--card-radius)",
        width: "100%", maxWidth: "500px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--unsaac-gray-border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <h3 style={{ margin: 0 }}>{isEdit ? "Editar Usuario" : "Crear Usuario"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--unsaac-text-secondary)" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Role changed banner */}
          {roleChanged && (
            <div style={{
              backgroundColor: "#DBEAFE", border: "1px solid #93C5FD",
              borderRadius: "var(--radius-md)", padding: "10px 14px",
              display: "flex", alignItems: "flex-start", gap: "8px",
            }}>
              <Info size={15} color="#1E40AF" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: "var(--font-size-body-small)", color: "#1E40AF" }}>
                Los cambios de rol toman efecto en el siguiente inicio de sesión del usuario.
              </p>
            </div>
          )}

          {/* Nombre (solo edición, campo informativo en creación) */}
          {!isEdit && (
            <div>
              <label style={{ display: "block", fontSize: "var(--font-size-label)", fontWeight: 500, marginBottom: 6, color: "var(--unsaac-text-primary)" }}>
                Nombre completo
              </label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Ej. María García Quispe" />
            </div>
          )}

          {/* Correo */}
          <div>
            <label style={{ display: "block", fontSize: "var(--font-size-label)", fontWeight: 500, marginBottom: 6, color: "var(--unsaac-text-primary)" }}>
              Correo institucional <span style={{ color: "var(--unsaac-red)" }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: emailDuplicate ? "var(--color-danger)" : "var(--unsaac-gray-border)",
              }}
              placeholder="usuario@unsaac.edu.pe"
            />
            {emailDuplicate && (
              <div style={{
                marginTop: "6px", display: "flex", alignItems: "center", gap: "6px",
                color: "var(--color-danger)", fontSize: "var(--font-size-caption)",
              }}>
                <AlertCircle size={13} />
                Este correo ya está registrado en el sistema.
              </div>
            )}
          </div>

          {/* Rol */}
          <div>
            <label style={{ display: "block", fontSize: "var(--font-size-label)", fontWeight: 500, marginBottom: 6, color: "var(--unsaac-text-primary)" }}>
              Rol del usuario <span style={{ color: "var(--unsaac-red)" }}>*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              style={inputStyle}
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Oficina */}
          <div>
            <label style={{ display: "block", fontSize: "var(--font-size-label)", fontWeight: 500, marginBottom: 6, color: "var(--unsaac-text-primary)" }}>
              Oficina asignada
            </label>
            <select value={office} onChange={(e) => setOffice(e.target.value)} style={inputStyle}>
              {OFFICES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {isEdit && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ fontSize: "var(--font-size-label)", fontWeight: 500, color: "var(--unsaac-text-primary)" }}>
                Estado de la cuenta
              </label>
              <button
                onClick={() => setActive(!active)}
                style={{
                  width: "40px", height: "22px", borderRadius: "99px", border: "none",
                  cursor: "pointer",
                  backgroundColor: active ? "var(--unsaac-red)" : "#D1D5DB",
                  position: "relative", transition: "background-color 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: "3px",
                  left: active ? "21px" : "3px",
                  width: "16px", height: "16px",
                  borderRadius: "50%", backgroundColor: "#fff",
                  transition: "left 0.2s",
                }} />
              </button>
            </div>
          )}
        </div>

        <div style={{
          padding: "16px 24px", borderTop: "1px solid var(--unsaac-gray-border)",
          display: "flex", justifyContent: "flex-end", gap: "10px",
        }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", border: "1px solid var(--unsaac-gray-border)",
            borderRadius: "var(--radius-md)", backgroundColor: "#fff",
            fontSize: "var(--font-size-body-small)", cursor: "pointer",
          }}>Cancelar</button>
          <button
            disabled={!canSave}
            onClick={() => canSave && onSave({ name, email, role, office, active })}
            style={{
              padding: "9px 24px", border: "none",
              borderRadius: "var(--radius-md)",
              backgroundColor: canSave ? "var(--unsaac-red)" : "#D1D5DB",
              color: canSave ? "#fff" : "#9CA3AF",
              fontSize: "var(--font-size-body-small)", fontWeight: 600,
              cursor: canSave ? "pointer" : "not-allowed",
            }}
          >
            {isEdit ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function UserManagement() {
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("Todos");
  const [modalUser, setModalUser] = useState<SystemUser | "new" | null>(null);
  const [savedBanner, setSavedBanner] = useState("");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "Todos" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const existingEmails = users.map((u) => u.email.toLowerCase());

  const handleSave = (data: Omit<SystemUser, "id">) => {
    if (modalUser === "new") {
      const newUser: SystemUser = { id: Date.now(), ...data };
      setUsers((prev) => [...prev, newUser]);
      setSavedBanner(`Usuario "${data.name}" creado correctamente.`);
    } else if (modalUser) {
      setUsers((prev) => prev.map((u) => (u.id === modalUser.id ? { ...u, ...data } : u)));
      setSavedBanner(`Usuario "${data.name}" actualizado.`);
    }
    setModalUser(null);
    setTimeout(() => setSavedBanner(""), 4000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--unsaac-gray-page)", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#fff", borderBottom: "1px solid var(--unsaac-gray-border)",
        padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "16px", flexWrap: "wrap",
      }}>
        <div>
          <h1 style={{ margin: 0 }}>Gestión de Usuarios</h1>
          <p style={{ margin: 0, fontSize: "var(--font-size-body-small)", color: "var(--unsaac-text-secondary)" }}>
            Administrar cuentas, roles y accesos del sistema
          </p>
        </div>
        <button
          onClick={() => setModalUser("new")}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", backgroundColor: "var(--unsaac-red)", color: "#fff",
            border: "none", borderRadius: "var(--radius-md)",
            fontSize: "var(--font-size-body-small)", fontWeight: 600, cursor: "pointer",
          }}
        >
          <UserPlus size={16} />
          Crear Usuario
        </button>
      </div>

      <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {savedBanner && (
          <div style={{
            backgroundColor: "var(--status-approved-bg)",
            border: "1px solid var(--status-approved-border)",
            borderRadius: "var(--radius-md)", padding: "12px 16px",
            color: "var(--status-approved-text)", fontSize: "var(--font-size-body-small)",
          }}>
            ✓ {savedBanner}
          </div>
        )}

        {/* Filters */}
        <div style={{
          backgroundColor: "#fff", border: "1px solid var(--unsaac-gray-border)",
          borderRadius: "var(--card-radius)", padding: "16px 20px",
          display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center",
        }}>
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: "360px" }}>
            <Search size={14} color="var(--unsaac-text-secondary)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              style={{ ...inputStyle, paddingLeft: "32px" }}
            />
          </div>
          <select
            value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            style={{ ...inputStyle, width: "auto", minWidth: "160px" }}
          >
            <option value="Todos">Todos los roles</option>
            {ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <span style={{ fontSize: "var(--font-size-caption)", color: "var(--unsaac-text-secondary)", marginLeft: "auto" }}>
            {filtered.length} usuario{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div style={{
          backgroundColor: "#fff", border: "1px solid var(--unsaac-gray-border)",
          borderRadius: "var(--card-radius)", overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-size-body-small)" }}>
              <thead>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  {["Nombre", "Correo institucional", "Rol", "Oficina", "Estado", "Acciones"].map((col) => (
                    <th key={col} style={{
                      padding: "12px 16px",
                      textAlign: col === "Acciones" || col === "Estado" ? "center" : "left",
                      fontWeight: 600, color: "var(--unsaac-text-secondary)",
                      fontSize: "var(--font-size-caption)", textTransform: "uppercase",
                      letterSpacing: "0.04em", borderBottom: "1px solid var(--unsaac-gray-border)",
                      whiteSpace: "nowrap",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--unsaac-gray-border)" : "none", opacity: u.active ? 1 : 0.6 }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FAFAFA")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "50%",
                          backgroundColor: "var(--unsaac-red)", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: "12px", fontWeight: 700,
                        }}>
                          {u.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--unsaac-text-secondary)" }}>{u.email}</td>
                    <td style={{ padding: "14px 16px" }}><RoleBadge role={u.role} /></td>
                    <td style={{ padding: "14px 16px", color: "var(--unsaac-text-secondary)", fontSize: "var(--font-size-body-small)" }}>
                      {u.office === "N/A" ? <span style={{ color: "#D1D5DB" }}>—</span> : u.office}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: "99px",
                        fontSize: "var(--font-size-caption)", fontWeight: 600,
                        backgroundColor: u.active ? "var(--status-approved-bg)" : "var(--status-pending-bg)",
                        color: u.active ? "var(--status-approved-text)" : "var(--status-pending-text)",
                        border: `1px solid ${u.active ? "var(--status-approved-border)" : "var(--status-pending-border)"}`,
                      }}>
                        {u.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <button
                        onClick={() => setModalUser(u)}
                        title="Editar"
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: "30px", height: "30px",
                          border: "1px solid var(--unsaac-gray-border)",
                          borderRadius: "var(--radius-md)", backgroundColor: "#fff",
                          cursor: "pointer", color: "var(--unsaac-text-secondary)",
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--unsaac-text-secondary)" }}>
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{
            padding: "10px 16px", borderTop: "1px solid var(--unsaac-gray-border)",
            fontSize: "var(--font-size-caption)", color: "var(--unsaac-text-secondary)",
            display: "flex", gap: "16px",
          }}>
            <span>{users.filter(u => u.active).length} activos</span>
            <span>·</span>
            <span>{users.filter(u => !u.active).length} inactivos</span>
            <span>·</span>
            <span>{users.length} total</span>
          </div>
        </div>
      </div>

      {modalUser !== null && (
        <UserModal
          user={modalUser === "new" ? null : modalUser}
          existingEmails={modalUser === "new" ? existingEmails : existingEmails.filter(e => e !== (modalUser as SystemUser).email.toLowerCase())}
          onClose={() => setModalUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
