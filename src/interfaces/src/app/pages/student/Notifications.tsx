import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  XCircle,
  CheckCheck,
  Download,
  Upload,
  Check,
} from "lucide-react";

type NotifType = "overdue" | "observed" | "deadline" | "approved" | "rejected" | "system" | "payment";

interface Notif {
  id: number;
  type: NotifType;
  category: "tramites" | "sistema" | "recordatorios";
  read: boolean;
  title: string;
  body: string;
  time: string;
  date: string;
  expedient?: string;
}

const allNotifications: Notif[] = [
  {
    id: 1,
    type: "overdue",
    category: "recordatorios",
    read: false,
    title: "Plazo VENCIDO — Expediente 2026-CERT-00087",
    body: "El expediente 2026-CERT-00087 (Certificado de Estudios) superó el plazo máximo de atención. Se requiere acción inmediata.",
    time: "Hace 1h",
    date: "06/06/2026",
    expedient: "2026-CERT-00087",
  },
  {
    id: 2,
    type: "observed",
    category: "tramites",
    read: false,
    title: "Observación en tu expediente 2026-CARNE-00120",
    body: "El DNI adjunto está vencido. Debes subir un documento de identidad vigente para continuar con tu trámite de Carné Universitario.",
    time: "Hace 3h",
    date: "06/06/2026",
    expedient: "2026-CARNE-00120",
  },
  {
    id: 3,
    type: "deadline",
    category: "recordatorios",
    read: false,
    title: "Plazo próximo — 2026-BACH-00121 vence mañana",
    body: "El expediente 2026-BACH-00121 (Grado de Bachiller) tiene 1 día hábil restante antes de vencer el plazo.",
    time: "Hace 5h",
    date: "05/06/2026",
    expedient: "2026-BACH-00121",
  },
  {
    id: 4,
    type: "approved",
    category: "tramites",
    read: true,
    title: "¡Expediente 2026-CERT-00118 APROBADO!",
    body: "Tu trámite de Certificado de Estudios ha sido aprobado. Ya puedes descargar tu documento en la sección de trámites.",
    time: "Ayer",
    date: "05/06/2026",
    expedient: "2026-CERT-00118",
  },
  {
    id: 5,
    type: "rejected",
    category: "tramites",
    read: true,
    title: "Expediente 2026-TRAS-00115 RECHAZADO",
    body: "El expediente 2026-TRAS-00115 fue rechazado. Motivo: No cumple con los requisitos mínimos de promedio ponderado.",
    time: "Hace 2 días",
    date: "04/06/2026",
    expedient: "2026-TRAS-00115",
  },
  {
    id: 6,
    type: "payment",
    category: "sistema",
    read: true,
    title: "Pago validado correctamente",
    body: "Tu comprobante de pago (N° Op. 0012345678) ha sido validado por la Oficina de Tesorería.",
    time: "Hace 3 días",
    date: "03/06/2026",
  },
  {
    id: 7,
    type: "system",
    category: "sistema",
    read: true,
    title: "Mantenimiento programado del sistema",
    body: "El Sistema TUPA estará en mantenimiento el sábado 08/06/2026 de 22:00 a 02:00 hrs. Los trámites no se verán afectados.",
    time: "Hace 4 días",
    date: "02/06/2026",
  },
];

const TABS = [
  { key: "all", label: "Todas", count: allNotifications.length },
  { key: "unread", label: "No leídas", count: allNotifications.filter((n) => !n.read).length },
  { key: "tramites", label: "Trámites", count: allNotifications.filter((n) => n.category === "tramites").length },
  { key: "sistema", label: "Sistema", count: allNotifications.filter((n) => n.category === "sistema").length },
  { key: "recordatorios", label: "Recordatorios", count: allNotifications.filter((n) => n.category === "recordatorios").length },
];

function NotifIconBig({ type }: { type: NotifType }) {
  const base = "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0";
  if (type === "overdue")
    return <div className={`${base} bg-[#FEE2E2]`}><AlertTriangle className="h-5 w-5 text-[#EF4444]" /></div>;
  if (type === "observed")
    return <div className={`${base} bg-[#FEF3C7]`}><AlertTriangle className="h-5 w-5 text-[#F59E0B]" /></div>;
  if (type === "deadline")
    return <div className={`${base} bg-[#FEF3C7]`}><Clock className="h-5 w-5 text-[#F59E0B]" /></div>;
  if (type === "approved" || type === "payment")
    return <div className={`${base} bg-[#D1FAE5]`}><CheckCircle2 className="h-5 w-5 text-[#10B981]" /></div>;
  if (type === "rejected")
    return <div className={`${base} bg-[#FEE2E2]`}><XCircle className="h-5 w-5 text-[#EF4444]" /></div>;
  return <div className={`${base} bg-[#DBEAFE]`}><FileText className="h-5 w-5 text-[#3B82F6]" /></div>;
}

function getBorderColor(type: NotifType) {
  if (type === "overdue" || type === "rejected") return "border-l-[3px] border-l-[#EF4444]";
  if (type === "observed") return "border-l-[3px] border-l-[#F59E0B]";
  if (type === "deadline") return "border-l-[3px] border-l-[#F59E0B]";
  if (type === "approved" || type === "payment") return "border-l-[3px] border-l-[#10B981]";
  return "border-l-[3px] border-l-[#3B82F6]";
}

function getCardBg(notif: Notif) {
  if (!notif.read) return "bg-[#FEF2F2]";
  return "bg-[#F9FAFB]";
}

export function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(allNotifications);
  const [expanded, setExpanded] = useState<number | null>(null);

  const overdueNotifs = notifications.filter((n) => n.type === "overdue");
  const unreadCount = notifications.filter((n) => !n.read).length;

  const visibleNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.category === activeTab;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOneRead = (id: number) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-[var(--unsaac-text-primary)] mb-1">
            Notificaciones
          </h1>
          <p className="text-[var(--unsaac-text-secondary)]">
            {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : "Todo al día"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllRead}
            className="bg-[var(--unsaac-gold)] hover:bg-[var(--unsaac-gold-hover)] text-white"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Urgent Banner */}
      {overdueNotifs.length > 0 && (
        <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-[#92400E] mb-2">
                Tienes {overdueNotifs.length} expediente{overdueNotifs.length > 1 ? "s" : ""} con plazo vencido
              </p>
              <div className="flex flex-wrap gap-2">
                {overdueNotifs.map((n) => (
                  <Link
                    key={n.id}
                    to={`/dashboard/student/tracking/${n.expedient}`}
                    className="inline-flex items-center gap-1 bg-[#F59E0B] text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-[#D97706] transition-colors"
                  >
                    Ver {n.expedient}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[var(--unsaac-red)] text-[var(--unsaac-red)]"
                  : "border-transparent text-[#6B7280] hover:text-[var(--unsaac-text-primary)]"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.key
                      ? "bg-[var(--unsaac-red)] text-white"
                      : "bg-[#F3F4F6] text-[#6B7280]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Cards */}
      <div className="space-y-3">
        {visibleNotifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-[#6B7280]">
              No hay notificaciones en esta categoría
            </CardContent>
          </Card>
        )}

        {visibleNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`border rounded-xl overflow-hidden transition-all ${getBorderColor(notif.type)} ${getCardBg(notif)}`}
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                <NotifIconBig type={notif.type} />

                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h4
                      className={`text-sm leading-snug ${
                        !notif.read
                          ? "font-semibold text-[var(--unsaac-text-primary)]"
                          : "font-medium text-[#6B7280]"
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notif.read && (
                        <div className="w-2 h-2 bg-[#3B82F6] rounded-full" />
                      )}
                      <span className="text-xs text-[#9CA3AF]">{notif.time}</span>
                    </div>
                  </div>

                  {/* Expanded body */}
                  {expanded === notif.id && (
                    <p className="text-sm text-[#6B7280] mb-3 leading-relaxed">{notif.body}</p>
                  )}

                  {/* Action row */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Toggle expand */}
                    <button
                      onClick={() => setExpanded(expanded === notif.id ? null : notif.id)}
                      className="text-xs text-[#6B7280] hover:text-[var(--unsaac-text-primary)] underline"
                    >
                      {expanded === notif.id ? "Ver menos" : "Ver detalle"}
                    </button>

                    {/* Type-specific action */}
                    {notif.type === "observed" && (
                      <Link
                        to={`/dashboard/student/procedures?action=fix&id=${notif.expedient}`}
                        className="inline-flex items-center gap-1 bg-[#F59E0B] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#D97706] transition-colors"
                      >
                        <Upload className="h-3 w-3" />
                        Subsanar ahora
                      </Link>
                    )}
                    {notif.type === "overdue" && notif.expedient && (
                      <Link
                        to={`/dashboard/student/tracking/${notif.expedient}`}
                        className="inline-flex items-center gap-1 bg-[#EF4444] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#DC2626] transition-colors"
                      >
                        Ver expediente
                      </Link>
                    )}
                    {notif.type === "approved" && (
                      <button className="inline-flex items-center gap-1 bg-[#10B981] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#059669] transition-colors">
                        <Download className="h-3 w-3" />
                        Descargar resultado
                      </button>
                    )}
                    {notif.type === "deadline" && notif.expedient && (
                      <Link
                        to={`/dashboard/student/tracking/${notif.expedient}`}
                        className="inline-flex items-center gap-1 bg-[#F59E0B] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#D97706] transition-colors"
                      >
                        <Clock className="h-3 w-3" />
                        Ver expediente
                      </Link>
                    )}

                    {/* Mark as read */}
                    {!notif.read && (
                      <button
                        onClick={() => markOneRead(notif.id)}
                        className="inline-flex items-center gap-1 text-xs text-[#6B7280] hover:text-[var(--unsaac-text-primary)] border border-[#E5E7EB] px-2 py-1.5 rounded-lg hover:bg-white transition-colors"
                      >
                        <Check className="h-3 w-3" />
                        Marcar como leída
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
