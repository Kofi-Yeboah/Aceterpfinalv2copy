import { useEffect } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileWarning,
  ShieldAlert,
  X,
} from "lucide-react";

interface NotificationTrayProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll: () => void;
}

interface TrayNotification {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  pill: string;
  pillClassName: string;
  accentClassName: string;
  icon: React.ReactNode;
}

const trayNotifications: TrayNotification[] = [
  {
    id: "approval-leave",
    title: "Leave approval pending",
    detail: "Ama Boateng's annual leave request has been waiting for approval since yesterday.",
    timeLabel: "Due today by 3:00 PM",
    pill: "Approval",
    pillClassName: "bg-blue-50 text-blue-700 border border-blue-100",
    accentClassName: "from-blue-600/15 via-blue-500/5 to-transparent",
    icon: <ClipboardCheck size={16} className="text-blue-700" />,
  },
  {
    id: "deadline-procurement",
    title: "Procurement deadline approaching",
    detail: "Q2 ICT equipment requisitions close tomorrow. Two department submissions are still outstanding.",
    timeLabel: "Closes in 18 hours",
    pill: "Deadline",
    pillClassName: "bg-amber-50 text-amber-700 border border-amber-100",
    accentClassName: "from-amber-500/20 via-amber-400/5 to-transparent",
    icon: <CalendarClock size={16} className="text-amber-700" />,
  },
  {
    id: "timesheet",
    title: "Timesheet reminder",
    detail: "Project team leads need to submit Friday timesheet approvals before payroll lock at 5:30 PM.",
    timeLabel: "Reminder sent 12 minutes ago",
    pill: "Payroll",
    pillClassName: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    accentClassName: "from-emerald-500/20 via-emerald-400/5 to-transparent",
    icon: <Clock3 size={16} className="text-emerald-700" />,
  },
  {
    id: "compliance",
    title: "Compliance document expiring",
    detail: "One vendor tax clearance certificate expires this week and needs legal review.",
    timeLabel: "Expires in 2 days",
    pill: "Compliance",
    pillClassName: "bg-rose-50 text-rose-700 border border-rose-100",
    accentClassName: "from-rose-500/20 via-rose-400/5 to-transparent",
    icon: <ShieldAlert size={16} className="text-rose-700" />,
  },
  {
    id: "reporting",
    title: "Donor report milestone",
    detail: "The Mastercard Foundation reporting pack is ready for final sign-off before dispatch.",
    timeLabel: "Scheduled for tomorrow morning",
    pill: "Reporting",
    pillClassName: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    accentClassName: "from-indigo-500/20 via-indigo-400/5 to-transparent",
    icon: <FileWarning size={16} className="text-indigo-700" />,
  },
];

export function NotificationTray({ isOpen, onClose, onViewAll }: NotificationTrayProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const unreadCount = trayNotifications.length;

  return (
    <div
      className={`fixed inset-0 z-30 transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/25 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-[57px] bottom-0 w-full max-w-[420px] border-l border-slate-200 bg-slate-50 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-slate-200 bg-gradient-to-br from-[#0d0d6f] via-[#0B01D0] to-[#1d4ed8] px-5 pb-5 pt-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
                  <Bell size={12} />
                  Notification Tray
                </div>
                <h2 className="text-[22px] font-semibold leading-tight">Approvals and deadlines</h2>
                <p className="mt-1 text-sm text-white/75">
                  Priority reminders across approvals, payroll, procurement, and reporting.
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Close notifications"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/65">Unread</p>
                <p className="mt-1 text-2xl font-semibold">{unreadCount}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/65">Due today</p>
                <p className="mt-1 text-2xl font-semibold">2</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/65">Escalated</p>
                <p className="mt-1 text-2xl font-semibold">1</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
            <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Showing urgent reminders first</span>
            </div>
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0B01D0] transition-colors hover:text-[#0900a5]"
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {trayNotifications.map((notification, index) => (
                <article
                  key={notification.id}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                >
                  <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${notification.accentClassName}`} />
                  <div className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[#0B01D0]" />
                  <div className="px-5 py-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                          {notification.icon}
                        </div>
                        <div>
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${notification.pillClassName}`}
                            >
                              {notification.pill}
                            </span>
                            {index === 0 && (
                              <span className="rounded-full bg-[#0B01D0]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0B01D0]">
                                New
                              </span>
                            )}
                          </div>
                          <h3 className="text-[15px] font-semibold text-slate-900">{notification.title}</h3>
                        </div>
                      </div>
                    </div>

                    <p className="pr-4 text-[13px] leading-6 text-slate-600">{notification.detail}</p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600">
                        <CheckCircle2 size={13} className="text-[#0B01D0]" />
                        {notification.timeLabel}
                      </div>
                      <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:border-[#0B01D0]/20 hover:bg-[#0B01D0]/5 hover:text-[#0B01D0]">
                        Open item
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
