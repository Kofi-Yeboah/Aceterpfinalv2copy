// ──────────────────────────────────────────────────────────────────────────────
// Notification & reminder engine.
//
// The business requirements ask for email / SMS / in-app notification at every
// workflow stage, reminders to approvers after 48–72h of inactivity, escalation
// when those lapse, and reminders for expiring vendor documents, upcoming and
// overdue deliverables, and contract expiry.
//
// There is no backend here, so "sending" means recording the dispatch against
// the channels the recipient would have been reached on. A reminder sweep runs
// on load and on an interval, which is what turns the scheduled reminders into
// real notifications and escalates the ones that went unanswered.
// ──────────────────────────────────────────────────────────────────────────────

import type { ProcurementRole } from "./currentUser";

export type NotificationChannel = "In-App" | "Email" | "SMS";
export type NotificationCategory = "Approval" | "Reminder" | "Escalation" | "Alert" | "Info";
export type NotificationModule =
  | "Procurement Planning"
  | "Requisitions"
  | "Supplier Management"
  | "Sourcing"
  | "Contract Management"
  | "Invoices & Payments";

export interface AppNotification {
  id: string;
  sentAt: string; // ISO timestamp
  category: NotificationCategory;
  module: NotificationModule;
  subject: string;
  body: string;
  /** Role the notification is addressed to, when it is a station rather than a person. */
  recipientRole?: ProcurementRole;
  recipientName?: string;
  channels: NotificationChannel[];
  read: boolean;
  /** Business key of the record this concerns, e.g. "PR-2026-101". */
  entityRef?: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
}

export interface ScheduledReminder {
  id: string;
  entityRef: string;
  entityType: "Requisition" | "Plan Item" | "Deliverable" | "Invoice" | "Vendor Document" | "Contract" | "Change Request";
  module: NotificationModule;
  subject: string;
  body: string;
  recipientRole?: ProcurementRole;
  recipientName?: string;
  /** When the action became/becomes due. */
  dueDate: string; // YYYY-MM-DD
  /** Inactivity window before the first reminder fires (48–72h per the spec). */
  reminderAfterHours: number;
  /** Further inactivity before the matter is escalated upward. */
  escalateAfterHours: number;
  escalateToRole?: ProcurementRole;
  createdAt: string; // ISO
  lastRemindedAt?: string;
  escalatedAt?: string;
  resolved: boolean;
}

type Listener = () => void;
let listeners: Listener[] = [];

let notifications: AppNotification[] = [];
let reminders: ScheduledReminder[] = [];
let seq = 0;

function nextId(prefix: string) {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${seq}`;
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// ── Dispatch ────────────────────────────────────────────────────────────────

export function notify(opts: {
  category: NotificationCategory;
  module: NotificationModule;
  subject: string;
  body: string;
  recipientRole?: ProcurementRole;
  recipientName?: string;
  channels?: NotificationChannel[];
  entityRef?: string;
  priority?: AppNotification["priority"];
}): AppNotification {
  const record: AppNotification = {
    id: nextId("ntf"),
    sentAt: new Date().toISOString(),
    category: opts.category,
    module: opts.module,
    subject: opts.subject,
    body: opts.body,
    recipientRole: opts.recipientRole,
    recipientName: opts.recipientName,
    channels: opts.channels ?? ["In-App", "Email"],
    read: false,
    entityRef: opts.entityRef,
    priority: opts.priority ?? "Normal",
  };
  notifications = [record, ...notifications];
  notifyListeners();
  return record;
}

/** Fan one message out to several stations at once (e.g. all contract coordinators). */
export function notifyAll(
  recipients: { role?: ProcurementRole; name?: string }[],
  opts: Omit<Parameters<typeof notify>[0], "recipientRole" | "recipientName">
): AppNotification[] {
  return recipients.map((r) => notify({ ...opts, recipientRole: r.role, recipientName: r.name }));
}

// ── Reminders ───────────────────────────────────────────────────────────────

export function scheduleReminder(opts: {
  entityRef: string;
  entityType: ScheduledReminder["entityType"];
  module: NotificationModule;
  subject: string;
  body: string;
  recipientRole?: ProcurementRole;
  recipientName?: string;
  dueDate: string;
  reminderAfterHours?: number;
  escalateAfterHours?: number;
  escalateToRole?: ProcurementRole;
}): ScheduledReminder {
  // Replace any live reminder for the same record so a resubmission does not
  // leave the previous timer running against a stale stage.
  reminders = reminders.filter((r) => !(r.entityRef === opts.entityRef && r.entityType === opts.entityType && !r.resolved));

  const record: ScheduledReminder = {
    id: nextId("rem"),
    entityRef: opts.entityRef,
    entityType: opts.entityType,
    module: opts.module,
    subject: opts.subject,
    body: opts.body,
    recipientRole: opts.recipientRole,
    recipientName: opts.recipientName,
    dueDate: opts.dueDate,
    reminderAfterHours: opts.reminderAfterHours ?? 48,
    escalateAfterHours: opts.escalateAfterHours ?? 72,
    escalateToRole: opts.escalateToRole,
    createdAt: new Date().toISOString(),
    resolved: false,
  };
  reminders = [...reminders, record];
  notifyListeners();
  return record;
}

/** Called when the awaited action finally happens, so the timer stops. */
export function resolveReminder(entityRef: string, entityType?: ScheduledReminder["entityType"]) {
  let changed = false;
  reminders = reminders.map((r) => {
    if (r.entityRef !== entityRef) return r;
    if (entityType && r.entityType !== entityType) return r;
    if (r.resolved) return r;
    changed = true;
    return { ...r, resolved: true };
  });
  if (changed) notifyListeners();
}

export function getReminders() {
  return reminders;
}

function hoursSince(iso: string, now: Date): number {
  return (now.getTime() - new Date(iso).getTime()) / 36e5;
}

/**
 * Materialises due reminders into notifications and escalates the ones that
 * have gone unanswered past their window. Idempotent within a window: a
 * reminder re-fires only once per `reminderAfterHours` interval.
 */
export function runReminderSweep(now: Date = new Date()): number {
  let fired = 0;
  const todayStr = now.toISOString().split("T")[0];

  reminders = reminders.map((r) => {
    if (r.resolved) return r;

    const anchor = r.lastRemindedAt ?? r.createdAt;
    const idleHours = hoursSince(anchor, now);
    const overdue = r.dueDate < todayStr;
    let updated = r;

    // Escalate first: an item both idle past the escalation window and unanswered
    // goes up the chain once, and keeps nagging the original station after that.
    if (!r.escalatedAt && hoursSince(r.createdAt, now) >= r.escalateAfterHours) {
      notify({
        category: "Escalation",
        module: r.module,
        subject: `ESCALATION: ${r.subject}`,
        body: `${r.body}\n\nNo action recorded within ${r.escalateAfterHours}h of ${r.entityType} ${r.entityRef} arriving at this stage. Escalated for intervention.`,
        recipientRole: r.escalateToRole ?? "Senior Management",
        channels: ["In-App", "Email", "SMS"],
        entityRef: r.entityRef,
        priority: "Urgent",
      });
      updated = { ...updated, escalatedAt: now.toISOString() };
      fired += 1;
    }

    if (idleHours >= r.reminderAfterHours) {
      notify({
        category: "Reminder",
        module: r.module,
        subject: overdue ? `OVERDUE: ${r.subject}` : `Reminder: ${r.subject}`,
        body: `${r.body}\n\n${overdue ? `This item passed its due date of ${r.dueDate}.` : `Due ${r.dueDate}.`} Awaiting action for ${Math.floor(idleHours)}h.`,
        recipientRole: r.recipientRole,
        recipientName: r.recipientName,
        channels: overdue ? ["In-App", "Email", "SMS"] : ["In-App", "Email"],
        entityRef: r.entityRef,
        priority: overdue ? "High" : "Normal",
      });
      updated = { ...updated, lastRemindedAt: now.toISOString() };
      fired += 1;
    }

    return updated;
  });

  if (fired > 0) notifyListeners();
  return fired;
}

// ── Reads ───────────────────────────────────────────────────────────────────

export function getNotifications(filter?: {
  module?: NotificationModule;
  category?: NotificationCategory;
  unreadOnly?: boolean;
  role?: ProcurementRole;
  name?: string;
}): AppNotification[] {
  return notifications.filter((n) => {
    if (filter?.module && n.module !== filter.module) return false;
    if (filter?.category && n.category !== filter.category) return false;
    if (filter?.unreadOnly && n.read) return false;
    // A notification addressed to a role reaches anyone holding it; one addressed
    // to a person reaches only them.
    if (filter?.role || filter?.name) {
      const roleHit = filter.role && n.recipientRole === filter.role;
      const nameHit = filter.name && n.recipientName === filter.name;
      if (!roleHit && !nameHit) return false;
    }
    return true;
  });
}

export function getUnreadCount(filter?: Parameters<typeof getNotifications>[0]): number {
  return getNotifications({ ...filter, unreadOnly: true }).length;
}

export function markRead(id: string) {
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  notifyListeners();
}

export function markAllRead(filter?: Parameters<typeof getNotifications>[0]) {
  const target = new Set(getNotifications(filter).map((n) => n.id));
  notifications = notifications.map((n) => (target.has(n.id) ? { ...n, read: true } : n));
  notifyListeners();
}

export function clearNotifications() {
  notifications = [];
  notifyListeners();
}

// ── Sweep scheduling ────────────────────────────────────────────────────────

let sweepTimer: ReturnType<typeof setInterval> | null = null;

/** Starts the periodic sweep. Safe to call more than once. */
export function startReminderSweep(intervalMs = 60_000) {
  if (sweepTimer) return;
  runReminderSweep();
  sweepTimer = setInterval(() => runReminderSweep(), intervalMs);
}

export function stopReminderSweep() {
  if (sweepTimer) {
    clearInterval(sweepTimer);
    sweepTimer = null;
  }
}
