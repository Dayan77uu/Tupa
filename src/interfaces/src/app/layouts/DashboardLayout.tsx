import { Outlet, Link, useLocation } from "react-router";
import {
  Home,
  FileText,
  FilePlus,
  FolderOpen,
  CreditCard,
  Bell,
  User,
  Users,
  Shield,
  BookOpen,
  Settings,
  BarChart3,
  ClipboardCheck,
  Building2,
  LogOut,
  Menu,
  X,
  Inbox,
  History,
  GitBranch,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationDropdown } from "../components/NotificationDropdown";

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const userRole = location.pathname.split("/")[2] || "student";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: "Inicio", path: `/dashboard/${userRole}` },
    ];

    if (userRole === "student" || userRole === "graduate" || userRole === "teacher" || userRole === "administrative") {
      return [
        ...baseItems,
        { icon: FileText, label: "Mis trámites", path: `/dashboard/${userRole}/procedures` },
        { icon: FilePlus, label: "Nueva solicitud", path: `/dashboard/${userRole}/new-request` },
        ...(userRole !== "teacher" ? [
          { icon: FolderOpen, label: "Mis documentos", path: `/dashboard/${userRole}/documents` },
        ] : []),
        { icon: CreditCard, label: "Pagos", path: `/dashboard/${userRole}/payments` },
        { icon: Bell, label: "Notificaciones", path: `/dashboard/${userRole}/notifications` },
        { icon: User, label: "Mi perfil", path: `/dashboard/${userRole}/profile` },
      ];
    }

    if (userRole === "mesa-partes") {
      return [
        ...baseItems,
        { icon: ClipboardCheck, label: "Solicitudes", path: `/dashboard/${userRole}` },
        { icon: Bell, label: "Notificaciones", path: `/dashboard/${userRole}/notifications` },
        { icon: User, label: "Mi perfil", path: `/dashboard/${userRole}/profile` },
      ];
    }

    if (userRole === "office") {
      return [
        { icon: Inbox, label: "Bandeja", path: `/dashboard/${userRole}`, badge: 12 },
        { icon: Bell, label: "Notificaciones", path: `/dashboard/${userRole}/notifications` },
        { icon: User, label: "Mi perfil", path: `/dashboard/${userRole}/profile` },
      ];
    }

    if (userRole === "manager") {
      return [
        ...baseItems,
        { icon: BarChart3, label: "Estadísticas", path: `/dashboard/${userRole}` },
        { icon: Bell, label: "Notificaciones", path: `/dashboard/${userRole}/notifications` },
        { icon: User, label: "Mi perfil", path: `/dashboard/${userRole}/profile` },
      ];
    }

    if (userRole === "admin") {
      return [
        { icon: Home, label: "Dashboard Global", path: `/dashboard/${userRole}` },
        { icon: BookOpen, label: "Catálogo TUPA", path: `/dashboard/${userRole}/catalogue` },
        { icon: Users, label: "Gestión Usuarios", path: `/dashboard/${userRole}/users` },
        { icon: GitBranch, label: "Flujos Derivación", path: `/dashboard/${userRole}/roles` },
        { icon: History, label: "Historial Versiones", path: `/dashboard/${userRole}/version-history` },
        { icon: BarChart3, label: "Reportes Globales", path: `/dashboard/${userRole}/reports` },
        { icon: Settings, label: "Configuración", path: `/dashboard/${userRole}/config` },
        { icon: ClipboardCheck, label: "Auditoría y Logs", path: `/dashboard/${userRole}/audit` },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const getRoleName = () => {
    const roles: Record<string, string> = {
      student: "Estudiante",
      graduate: "Egresado",
      teacher: "Docente",
      administrative: "Administrativo",
      "mesa-partes": "Mesa de Partes",
      office: "Personal Administrativo",
      manager: "Jefe de Oficina",
      admin: "Administrador",
    };
    return roles[userRole] || "Usuario";
  };

  const getUserName = () => {
    if (userRole === "office") return "Ana Huanca Torres";
    return "Juan Pérez López";
  };

  const getUserSubtitle = () => {
    if (userRole === "office") return "Oficina de Registro Académico";
    return null;
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Navbar */}
      <header className="bg-[var(--unsaac-red)] text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-md"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <span className="font-bold">UNSAAC</span>
              </div>
              <div>
                <h1 className="font-semibold text-sm sm:text-base">Sistema TUPA</h1>
                <p className="text-xs text-white/80 hidden sm:block">Universidad Nacional de San Antonio Abad del Cusco</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{getUserName()}</p>
              <p className="text-xs text-white/80">{getRoleName()}</p>
            </div>
            {/* Bell with dropdown */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 hover:bg-white/10 rounded-md"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--unsaac-gold)] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  3
                </span>
              </button>
              {notifOpen && (
                <NotificationDropdown
                  onClose={() => setNotifOpen(false)}
                  userRole={userRole}
                />
              )}
            </div>
            <button className="p-2 hover:bg-white/10 rounded-md">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {userRole === "admin" ? (
          /* ── ADMIN DARK SIDEBAR ── */
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed lg:sticky lg:translate-x-0 top-[57px] left-0 h-[calc(100vh-57px)] w-56 transition-transform duration-200 z-40 overflow-y-auto flex flex-col`}
            style={{ backgroundColor: "#2B2B2B", borderRight: "1px solid #3D3D3D" }}
          >
            {/* Logo + Badge */}
            <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #3D3D3D" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700 }}>UN</span>
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: "13px", fontWeight: 700, lineHeight: 1.2 }}>TUPA-UNSAAC</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>Sistema Administrativo</div>
                </div>
              </div>
              <span style={{
                display: "inline-block",
                backgroundColor: "var(--unsaac-gold)",
                color: "#1a1a1a",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: "99px",
              }}>
                Administrador
              </span>
            </div>

            {/* Nav items */}
            <nav style={{ padding: "12px 8px", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== `/dashboard/admin` && location.pathname.startsWith(item.path));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 12px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
                      backgroundColor: isActive ? "var(--unsaac-red)" : "transparent",
                      fontSize: "13px",
                      fontWeight: isActive ? 600 : 400,
                      transition: "background-color 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "#3D3D3D";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    }}
                  >
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #3D3D3D" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "32px", height: "32px",
                  backgroundColor: "var(--unsaac-red)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>C</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#fff", fontSize: "12px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Carlos Mamani R.
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>Administrador</div>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "rgba(255,255,255,0.5)" }}>
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </aside>
        ) : (
          /* ── DEFAULT LIGHT SIDEBAR ── */
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed lg:sticky lg:translate-x-0 top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-200 z-40 overflow-y-auto flex flex-col`}
          >
            <nav className="p-4 space-y-1 flex-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative ${
                      isActive
                        ? "bg-[var(--unsaac-red)] text-white"
                        : "hover:bg-sidebar-accent text-sidebar-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="w-6 h-6 bg-[var(--unsaac-red)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer with User Info */}
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[var(--unsaac-red)] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {getUserName().charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {getUserName()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleName()}
                  </p>
                  {getUserSubtitle() && (
                    <p className="text-xs text-muted-foreground truncate">
                      {getUserSubtitle()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 lg:ml-0 mt-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
