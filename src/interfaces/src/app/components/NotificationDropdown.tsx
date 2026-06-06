import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, AlertTriangle, Clock, FileText, XCircle, CheckCheck, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface DropdownNotif {
  id: number;
  type: "approved" | "observed" | "deadline" | "new" | "rejected" | "payment";
  read: boolean;
  title: string;
  time: string;
  expedient?: string;
  actionLabel?: string;
  actionPath?: string;
}

const dropdownNotifications: DropdownNotif[] = [
  {
    id: 1,
    type: "approved",
    read: false,
    title: "Tu expediente 2026-CERT-00118 fue APROBADO",
    time: "Hace 2h",
    expedient: "2026-CERT-00118",
    actionLabel: "Descargar",
    actionPath: "/dashboard/student/tracking/2026-CERT-00118",
  },
  {
    id: 2,
    type: "observed",
    read: false,
    title: "Observación en 2026-CARNE-00120",
    time: "Hace 3h",
    expedient: "2026-CARNE-00120",
    actionLabel: "Subsanar ahora →",
    actionPath: "/dashboard/student/procedures?action=fix&id=2026-CARNE-00120",
  },
  {
    id: 3,
    type: "deadline",
    read: false,
    title: "El expediente 2026-BACH-00121 vence mañana",
    time: "Hace 5h",
    expedient: "2026-BACH-00121",
  },
  {
    id: 4,
    type: "new",
    read: true,
    title: "Nueva solicitud recibida: 2026-CONV-00123",
    time: "Ayer",
    expedient: "2026-CONV-00123",
  },
  {
    id: 5,
    type: "rejected",
    read: true,
    title: "El expediente 2026-TRAS-00115 fue RECHAZADO",
    time: "Hace 2 días",
    expedient: "2026-TRAS-00115",
  },
  {
    id: 6,
    type: "payment",
    read: true,
    title: "Tu pago fue validado",
    time: "Hace 3 días",
  },
];

function NotifIcon({ type }: { type: DropdownNotif["type"] }) {
  if (type === "approved" || type === "payment")
    return (
      <div className="w-8 h-8 bg-[#D1FAE5] rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
      </div>
    );
  if (type === "observed")
    return (
      <div className="w-8 h-8 bg-[#FEF3C7] rounded-full flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
      </div>
    );
  if (type === "deadline")
    return (
      <div className="w-8 h-8 bg-[#FEF3C7] rounded-full flex items-center justify-center flex-shrink-0">
        <Clock className="h-4 w-4 text-[#F59E0B]" />
      </div>
    );
  if (type === "rejected")
    return (
      <div className="w-8 h-8 bg-[#FEE2E2] rounded-full flex items-center justify-center flex-shrink-0">
        <XCircle className="h-4 w-4 text-[#EF4444]" />
      </div>
    );
  return (
    <div className="w-8 h-8 bg-[#DBEAFE] rounded-full flex items-center justify-center flex-shrink-0">
      <FileText className="h-4 w-4 text-[#3B82F6]" />
    </div>
  );
}

interface Props {
  onClose: () => void;
  userRole: string;
}

export function NotificationDropdown({ onClose, userRole }: Props) {
  const [notifications, setNotifications] = useState(dropdownNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[380px] bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[var(--unsaac-text-primary)]">Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="w-5 h-5 bg-[var(--unsaac-red)] text-white rounded-full flex items-center justify-center text-xs font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-1 text-sm text-[var(--unsaac-gold)] hover:text-[var(--unsaac-gold-hover)] font-medium"
        >
          <CheckCheck className="h-4 w-4" />
          Marcar todas como leídas
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-[#F3F4F6]">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`px-4 py-3 transition-colors hover:bg-[#F9FAFB] ${
              !notif.read ? "bg-[#F0F9FF]" : "bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Unread dot */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
                {!notif.read ? (
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full" />
                ) : (
                  <div className="w-2 h-2" />
                )}
              </div>

              <NotifIcon type={notif.type} />

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-tight mb-1 ${
                    !notif.read
                      ? "font-medium text-[var(--unsaac-text-primary)]"
                      : "text-[#6B7280]"
                  }`}
                >
                  {notif.title}
                </p>
                <p className="text-xs text-[#9CA3AF] mb-2">{notif.time}</p>

                {/* Inline Action for Observed */}
                {notif.type === "observed" && notif.actionLabel && (
                  <Link
                    to={notif.actionPath || "#"}
                    onClick={onClose}
                    className="inline-flex items-center text-xs font-medium bg-[#F59E0B] text-white px-3 py-1 rounded-full hover:bg-[#D97706] transition-colors"
                  >
                    {notif.actionLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
        <Link
          to={`/dashboard/${userRole}/notifications`}
          onClick={onClose}
          className="flex items-center justify-center gap-1 text-sm text-[var(--unsaac-red)] hover:text-[var(--unsaac-red-hover)] font-medium"
        >
          Ver todas las notificaciones
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
