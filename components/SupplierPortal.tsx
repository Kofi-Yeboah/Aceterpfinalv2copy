import { useEffect, useMemo, useState } from "react";
import {
  Building2, User, FileText, Upload, Download, Clock, CheckCircle2, AlertTriangle,
  ShieldCheck, Lock, LogOut, Send, Search, Receipt, FilePlus2, X,
  CalendarClock, BadgeCheck, ArrowLeft, Paperclip, Ban,
} from "lucide-react";
import {
  getSuppliers, getSupplierById, supplierDisplayName, supplierEmail, getSupplierFlags,
  registerSupplier, addSupplierDocument, avgScore,
  FIRM_DOC_CHECKLIST, INDIVIDUAL_DOC_CHECKLIST, SUPPLIER_CATEGORIES, SUB_CATEGORIES,
  EXPERT_AREAS_OPTIONS, subscribe as subscribeSuppliers,
  type Supplier, type SupplierType,
} from "../lib/supplierStore";
import {
  getTendersForSupplier, getSubmissionsBySupplier, submitBid, withdrawSubmission,
  isTenderOpen, requestProfileUpdate, subscribe as subscribeTenders,
  type PublishedTender, type EnvelopeType, type SubmissionReceipt, type TenderDocument,
} from "../lib/tenderPortalStore";
import { getContracts, addInvoice, subscribe as subscribeContracts } from "../lib/contractStore";
import { getNotifications, markRead, subscribe as subscribeNotifications } from "../lib/notificationStore";
import { pickFiles, openFile, FileValidationError, type UploadedFile } from "../lib/fileUpload";
import { ProcurementTabs, ProcurementTabBar, type ProcurementTab } from "./procurement/ProcurementTabs";
import { ProcurementStatCards } from "./procurement/ProcurementStatCards";

/* ══════════════════════════════════════════════════════════════════════════════
   The supplier-facing side of the procurement suite: self-registration, tender
   download, sealed electronic bid submission, invoice submission against a
   contract, and profile updates that go to Procurement for review rather than
   editing the live record directly.
   ══════════════════════════════════════════════════════════════════════════════ */

type PortalTab = "home" | "tenders" | "submissions" | "contracts" | "profile" | "notifications";

function useStoreSync() {
  const [, force] = useState(0);
  useEffect(() => {
    const bump = () => force((n) => n + 1);
    const unsubs = [subscribeSuppliers(bump), subscribeTenders(bump), subscribeContracts(bump), subscribeNotifications(bump)];
    return () => unsubs.forEach((u) => u());
  }, []);
}

function toTenderDocs(files: UploadedFile[]): TenderDocument[] {
  return files.map((f) => ({
    id: f.id,
    name: f.name,
    type: f.type,
    size: f.sizeLabel,
    url: f.url,
    uploadedAt: f.uploadedAt,
  }));
}

const card = "bg-white rounded-2xl border border-slate-200 shadow-sm";
const btnPrimary =
  "px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2";
const btnGhost =
  "px-4 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2";
const input =
  "w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500";
const label = "block text-xs font-medium text-slate-600 mb-1";

export function SupplierPortal() {
  useStoreSync();
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [tab, setTab] = useState<PortalTab>("home");
  const [registering, setRegistering] = useState(false);

  const supplier = supplierId ? getSupplierById(supplierId) : undefined;

  if (!supplier) {
    return registering ? (
      <SelfRegistration
        onBack={() => setRegistering(false)}
        onRegistered={(id) => {
          setRegistering(false);
          setSupplierId(id);
        }}
      />
    ) : (
      <PortalSignIn onSignIn={setSupplierId} onRegister={() => setRegistering(true)} />
    );
  }

  const flags = getSupplierFlags(supplier);
  const unread = getNotifications({ unreadOnly: true, name: supplierDisplayName(supplier) }).length;

  const tabs: ProcurementTab<PortalTab>[] = [
    { key: "home", label: "Overview" },
    { key: "tenders", label: "Open Tenders" },
    { key: "submissions", label: "My Submissions" },
    { key: "contracts", label: "Contracts & Invoices" },
    { key: "profile", label: "My Profile" },
    { key: "notifications", label: "Notifications", count: unread },
  ];

  return (
    <div className="p-6 space-y-5 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className={`${card} p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-emerald-100 grid place-items-center">
              {supplier.type === "Firm" ? (
                <Building2 className="size-6 text-emerald-700" />
              ) : (
                <User className="size-6 text-emerald-700" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{supplierDisplayName(supplier)}</h1>
              <p className="text-sm text-slate-500">
                {supplier.supplierId} &middot; {supplier.category} &middot; {supplierEmail(supplier)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={supplier.status} />
            <button onClick={() => setSupplierId(null)} className={btnGhost}>
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Compliance banner */}
      {(flags.expiredDocs.length > 0 || flags.missingDocs.length > 0 || flags.expiringDocs.length > 0) && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex gap-3">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 space-y-1">
            <p className="font-medium">Action needed on your compliance documents</p>
            {flags.expiredDocs.length > 0 && <p>Expired: {flags.expiredDocs.join(", ")}. Upload a renewed copy to stay eligible for tenders.</p>}
            {flags.expiringDocs.length > 0 && (
              <p>Expiring soon: {flags.expiringDocs.map((d) => `${d.doc} (${d.daysLeft} days)`).join(", ")}.</p>
            )}
            {flags.missingDocs.length > 0 && <p>Not yet provided: {flags.missingDocs.join(", ")}.</p>}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={`${card} px-4 py-3`}>
        <ProcurementTabs tabs={tabs} active={tab} onChange={setTab} minWidth={80} />
      </div>

      {tab === "home" && <PortalHome supplier={supplier} onOpenTenders={() => setTab("tenders")} />}
      {tab === "tenders" && <TenderList supplier={supplier} />}
      {tab === "submissions" && <SubmissionHistory supplier={supplier} />}
      {tab === "contracts" && <ContractsAndInvoices supplier={supplier} />}
      {tab === "profile" && <ProfileTab supplier={supplier} />}
      {tab === "notifications" && <NotificationsTab supplier={supplier} />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Sign-in
   ──────────────────────────────────────────────────────────────────────────── */

function PortalSignIn({ onSignIn, onRegister }: { onSignIn: (id: string) => void; onRegister: () => void }) {
  const suppliers = getSuppliers();
  const [query, setQuery] = useState("");

  const filtered = suppliers.filter((v) => supplierDisplayName(v).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="text-center py-6">
          <div className="size-14 rounded-2xl bg-emerald-600 grid place-items-center mx-auto mb-4">
            <ShieldCheck className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">ACET Supplier &amp; Consultant Portal</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Download tender documents, submit bids securely, track your submissions and invoices.
          </p>
        </div>

        <div className={`${card} p-6`}>
          <h2 className="font-semibold text-slate-900 mb-1">Sign in to your supplier account</h2>
          <p className="text-sm text-slate-500 mb-4">
            Select your registered organisation or consultant profile to continue.
          </p>
          <div className="relative mb-3">
            <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className={`${input} pl-9`}
            />
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
            {filtered.length === 0 && (
              <p className="p-6 text-sm text-slate-500 text-center">No registered supplier matches that name.</p>
            )}
            {filtered.map((v) => (
              <button
                key={v.id}
                onClick={() => onSignIn(v.id)}
                className="w-full flex items-center justify-between gap-3 p-3 hover:bg-slate-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-lg bg-slate-100 grid place-items-center shrink-0">
                    {v.type === "Firm" ? <Building2 className="size-4 text-slate-600" /> : <User className="size-4 text-slate-600" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{supplierDisplayName(v)}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {v.supplierId} &middot; {v.category}
                    </p>
                  </div>
                </div>
                <StatusPill status={v.status} />
              </button>
            ))}
          </div>
        </div>

        <div className={`${card} p-6 text-center`}>
          <p className="text-sm text-slate-600 mb-3">Not registered with ACET yet?</p>
          <button onClick={onRegister} className={`${btnPrimary} mx-auto`}>
            <FilePlus2 className="size-4" /> Register as a supplier or consultant
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Self-registration
   ──────────────────────────────────────────────────────────────────────────── */

function SelfRegistration({ onBack, onRegistered }: { onBack: () => void; onRegistered: (id: string) => void }) {
  const [type, setType] = useState<SupplierType>("Firm");
  const [form, setForm] = useState<Record<string, string>>({});
  const [expertAreas, setExpertAreas] = useState<string[]>([]);
  const [docs, setDocs] = useState<Record<string, { file: UploadedFile; expiry: string }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState("");
  const [result, setResult] = useState<{ supplierId: string; id: string; warnings: string[] } | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const checklist = type === "Firm" ? FIRM_DOC_CHECKLIST : INDIVIDUAL_DOC_CHECKLIST;

  async function attach(docLabel: string) {
    setUploadError("");
    try {
      const files = await pickFiles({ multiple: false, uploadedBy: form.name || "Supplier" });
      if (files.length) setDocs((d) => ({ ...d, [docLabel]: { file: files[0], expiry: d[docLabel]?.expiry ?? "" } }));
    } catch (err) {
      setUploadError(err instanceof FileValidationError ? err.message : "That file could not be attached.");
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = type === "Firm" ? "Legal business name is required." : "Full legal name is required.";
    if (!form.email?.trim()) e.email = "An email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.phone?.trim()) e.phone = "A contact phone number is required.";
    if (!form.category) e.category = "Select a procurement category.";
    if (!form.address?.trim()) e.address = "An address is required.";

    if (type === "Firm") {
      if (!form.registrationNumber?.trim()) e.registrationNumber = "Company registration number is required.";
      if (!form.taxId?.trim()) e.taxId = "Tax identification number is required.";
      if (!form.contactPerson?.trim()) e.contactPerson = "A contact person is required.";
    } else {
      if (!form.idNumber?.trim()) e.idNumber = "An identification number is required.";
      if (!expertAreas.length) e.expertAreas = "Select at least one area of specialisation.";
    }

    // Mandatory identity/compliance documents
    const requiredDocs =
      type === "Firm"
        ? ["Certificate of Incorporation", "Tax Clearance Certificate"]
        : ["Passport / National ID Copy", "Proof of Residential Address"];
    const missing = requiredDocs.filter((d) => !docs[d]);
    if (missing.length) e.documents = `Upload the following before submitting: ${missing.join(", ")}.`;

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;

    const documentExpiry: Record<string, string> = {};
    Object.entries(docs).forEach(([labelKey, d]) => {
      if (d.expiry) documentExpiry[labelKey] = d.expiry;
    });

    const common = {
      category: form.category,
      subCategory: form.subCategory || "",
      documents: Object.keys(docs),
      documentExpiry,
      bankName: form.bankName || "",
      bankAccountNumber: form.bankAccountNumber || "",
    };

    const { supplier, flags } =
      type === "Firm"
        ? registerSupplier(
            "Firm",
            {
              ...common,
              legalBusinessName: form.name,
              registrationNumber: form.registrationNumber,
              taxId: form.taxId,
              registeredAddress: form.address,
              contactPerson: form.contactPerson,
              email: form.email,
              phone: form.phone,
              ownershipDetails: form.ownershipDetails || undefined,
              specialization: form.specialization ? form.specialization.split(",").map((s) => s.trim()) : undefined,
            },
            { registeredBy: form.name, source: "Self-Registration" }
          )
        : registerSupplier(
            "Individual",
            {
              ...common,
              legalName: form.name,
              contactEmail: form.email,
              contactPhone: form.phone,
              idType: (form.idType as "Passport" | "National ID" | "Driver's License") || "National ID",
              idNumber: form.idNumber,
              residentialAddress: form.address,
              expertAreas,
              historicalRates: [],
            },
            { registeredBy: form.name, source: "Self-Registration" }
          );

    const warnings: string[] = [];
    if (flags.duplicates.length)
      warnings.push(
        `A similar name is already registered (${flags.duplicates.map((d) => supplierDisplayName(d)).join(", ")}). Procurement will confirm whether this is a duplicate.`
      );
    if (flags.missingDocs.length) warnings.push(`Still outstanding: ${flags.missingDocs.join(", ")}.`);

    setResult({ supplierId: supplier.supplierId, id: supplier.id, warnings });
  }

  if (result) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className={`${card} max-w-2xl mx-auto p-8 text-center`}>
          <div className="size-14 rounded-full bg-emerald-100 grid place-items-center mx-auto mb-4">
            <CheckCircle2 className="size-7 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Registration submitted</h2>
          <p className="text-sm text-slate-600 mt-2">
            Your supplier identification number is <span className="font-semibold text-slate-900">{result.supplierId}</span>.
            Procurement will review your submission and supporting documents before your account becomes active. You will
            be notified by email once the review is complete.
          </p>
          {result.warnings.length > 0 && (
            <div className="mt-4 text-left rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 space-y-1">
              {result.warnings.map((w, i) => (
                <p key={i}>{w}</p>
              ))}
            </div>
          )}
          <button onClick={() => onRegistered(result.id)} className={`${btnPrimary} mx-auto mt-6`}>
            Continue to the portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-5">
        <button onClick={onBack} className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
          <ArrowLeft className="size-4" /> Back to sign in
        </button>

        <div className={`${card} p-6`}>
          <h1 className="text-lg font-semibold text-slate-900">Supplier &amp; consultant registration</h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete this form to join the ACET supplier database. Your registration becomes active once Procurement has
            reviewed the information and documents you provide.
          </p>

          <div className="flex gap-2 mt-5">
            {(["Firm", "Individual"] as SupplierType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  type === t ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t === "Firm" ? <Building2 className="size-4" /> : <User className="size-4" />}
                {t === "Firm" ? "Corporate entity" : "Individual consultant"}
              </button>
            ))}
          </div>
        </div>

        <div className={`${card} p-6 space-y-4`}>
          <h2 className="font-semibold text-slate-900 text-sm">
            {type === "Firm" ? "Company details" : "Personal details"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={type === "Firm" ? "Legal business name *" : "Full legal name *"} error={errors.name}>
              <input className={input} value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Email address *" error={errors.email}>
              <input className={input} type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Phone number *" error={errors.phone}>
              <input className={input} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            {type === "Firm" ? (
              <>
                <Field label="Company registration number *" error={errors.registrationNumber}>
                  <input className={input} value={form.registrationNumber ?? ""} onChange={(e) => set("registrationNumber", e.target.value)} />
                </Field>
                <Field label="Tax identification number *" error={errors.taxId}>
                  <input className={input} value={form.taxId ?? ""} onChange={(e) => set("taxId", e.target.value)} />
                </Field>
                <Field label="Contact person *" error={errors.contactPerson}>
                  <input className={input} value={form.contactPerson ?? ""} onChange={(e) => set("contactPerson", e.target.value)} />
                </Field>
                <Field label="Ownership details (optional)">
                  <input className={input} value={form.ownershipDetails ?? ""} onChange={(e) => set("ownershipDetails", e.target.value)} placeholder="e.g. 60% A. Mensah, 40% K. Owusu" />
                </Field>
                <Field label="Specialisation (comma separated)">
                  <input className={input} value={form.specialization ?? ""} onChange={(e) => set("specialization", e.target.value)} placeholder="e.g. IT Equipment, Networking" />
                </Field>
              </>
            ) : (
              <>
                <Field label="Identification type">
                  <select className={input} value={form.idType ?? "National ID"} onChange={(e) => set("idType", e.target.value)}>
                    {["National ID", "Passport", "Driver's License"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Identification number *" error={errors.idNumber}>
                  <input className={input} value={form.idNumber ?? ""} onChange={(e) => set("idNumber", e.target.value)} />
                </Field>
                <Field label="Tax identification number (where applicable)">
                  <input className={input} value={form.taxId ?? ""} onChange={(e) => set("taxId", e.target.value)} />
                </Field>
              </>
            )}
            <Field label={type === "Firm" ? "Registered address *" : "Residential address *"} error={errors.address}>
              <input className={input} value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label="Procurement category *" error={errors.category}>
              <select className={input} value={form.category ?? ""} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select…</option>
                {SUPPLIER_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Sub-category">
              <select className={input} value={form.subCategory ?? ""} onChange={(e) => set("subCategory", e.target.value)} disabled={!form.category}>
                <option value="">Select…</option>
                {(SUB_CATEGORIES[form.category] ?? []).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Bank name">
              <input className={input} value={form.bankName ?? ""} onChange={(e) => set("bankName", e.target.value)} />
            </Field>
            <Field label="Bank account number">
              <input className={input} value={form.bankAccountNumber ?? ""} onChange={(e) => set("bankAccountNumber", e.target.value)} />
            </Field>
          </div>

          {type === "Individual" && (
            <Field label="Areas of specialisation *" error={errors.expertAreas}>
              <div className="flex flex-wrap gap-1.5">
                {EXPERT_AREAS_OPTIONS.map((a) => {
                  const on = expertAreas.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setExpertAreas((prev) => (on ? prev.filter((x) => x !== a) : [...prev, a]))}
                      className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                        on ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </Field>
          )}
        </div>

        <div className={`${card} p-6`}>
          <h2 className="font-semibold text-slate-900 text-sm mb-1">Supporting documents</h2>
          <p className="text-xs text-slate-500 mb-4">
            Attach each document and, where it expires, record the expiry date so we can remind you before it lapses.
          </p>
          {errors.documents && <p className="text-xs text-rose-600 mb-3">{errors.documents}</p>}
          {uploadError && <p className="text-xs text-rose-600 mb-3">{uploadError}</p>}
          <div className="space-y-2">
            {checklist.map((docLabel) => {
              const attached = docs[docLabel];
              return (
                <div key={docLabel} className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-slate-200">
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-sm text-slate-800">{docLabel}</p>
                    {attached && (
                      <button onClick={() => openFile(attached.file)} className="text-xs text-emerald-700 hover:underline flex items-center gap-1 mt-0.5">
                        <Paperclip className="size-3" /> {attached.file.name} ({attached.file.sizeLabel})
                      </button>
                    )}
                  </div>
                  <input
                    type="date"
                    value={attached?.expiry ?? ""}
                    onChange={(e) =>
                      setDocs((d) => (d[docLabel] ? { ...d, [docLabel]: { ...d[docLabel], expiry: e.target.value } } : d))
                    }
                    disabled={!attached}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs disabled:bg-slate-100"
                    title="Expiry date, if applicable"
                  />
                  <button onClick={() => attach(docLabel)} className={btnGhost}>
                    <Upload className="size-4" /> {attached ? "Replace" : "Attach"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-6">
          <button onClick={onBack} className={btnGhost}>Cancel</button>
          <button onClick={submit} className={btnPrimary}>
            <Send className="size-4" /> Submit registration
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Portal tabs
   ──────────────────────────────────────────────────────────────────────────── */

function PortalHome({ supplier, onOpenTenders }: { supplier: Supplier; onOpenTenders: () => void }) {
  const tenders = getTendersForSupplier(supplier.id).filter(isTenderOpen);
  const subs = getSubmissionsBySupplier(supplier.id);
  const contracts = getContracts().filter((c) => c.party === supplierDisplayName(supplier));
  const score = avgScore(supplier.performance);

  return (
    <div className="space-y-5">
      <ProcurementStatCards
        variant="flush"
        stats={[
          { label: "Open tenders available", value: tenders.length, icon: <Search className="size-4" />, tone: "info" },
          { label: "Submissions made", value: subs.length, icon: <Send className="size-4" />, tone: "accent" },
          { label: "Contracts with ACET", value: contracts.length, icon: <Receipt className="size-4" />, tone: "success" },
          {
            label: "Performance rating",
            value: score > 0 ? `${score}/10` : "Not yet rated",
            icon: <BadgeCheck className="size-4" />,
            tone: "warning",
          },
        ]}
      />

      {supplier.status === "Pending Onboarding" && (
        <div className="rounded-2xl border border-sky-300 bg-sky-50 p-4 flex gap-3">
          <Clock className="size-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-sm text-sky-900">
            <p className="font-medium">Your registration is under review</p>
            <p>
              Procurement is verifying your details and documents. You can browse tenders, but you cannot submit a bid
              until your account is approved.
            </p>
          </div>
        </div>
      )}

      {(supplier.status === "Suspended" || supplier.status === "Blacklisted") && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 flex gap-3">
          <Ban className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm text-rose-900">
            <p className="font-medium">Your account is {supplier.status.toLowerCase()}</p>
            <p>You cannot participate in solicitations at present. Contact procurement@acet.org for guidance.</p>
          </div>
        </div>
      )}

      <div className={`${card} p-5`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Tenders closing soon</h2>
          <button onClick={onOpenTenders} className="text-sm text-emerald-700 hover:underline">View all</button>
        </div>
        {tenders.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">There are no open tenders in your categories right now.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {tenders.slice(0, 4).map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{t.title}</p>
                  <p className="text-xs text-slate-500">{t.tenderRef} &middot; {t.method} &middot; {t.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500">Closes</p>
                  <p className="text-sm font-medium text-slate-800">{t.closingDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TenderList({ supplier }: { supplier: Supplier }) {
  const [selected, setSelected] = useState<PublishedTender | null>(null);
  const tenders = getTendersForSupplier(supplier.id);

  if (selected) return <TenderDetail supplier={supplier} tender={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="space-y-4">
      {tenders.length === 0 && (
        <div className={`${card} p-10 text-center text-sm text-slate-500`}>
          No tenders are currently published to your account.
        </div>
      )}
      {tenders.map((t) => {
        const open = isTenderOpen(t);
        return (
          <div key={t.id} className={`${card} p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-500">{t.tenderRef}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    open ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {open ? "Open" : t.status}
                  </span>
                  {t.invitedSupplierIds.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-100 text-violet-700">
                      Invitation only
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900">{t.title}</h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{t.description}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-slate-500">
                  <span>{t.method}</span>
                  <span>{t.category}</span>
                  <span className="flex items-center gap-1">
                    <CalendarClock className="size-3.5" /> Closes {t.closingDate} at {t.closingTime}
                  </span>
                  <span>{t.documents.length} document(s)</span>
                </div>
              </div>
              <button onClick={() => setSelected(t)} className={btnPrimary}>
                View &amp; bid
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TenderDetail({ supplier, tender, onBack }: { supplier: Supplier; tender: PublishedTender; onBack: () => void }) {
  const [envelope, setEnvelope] = useState<EnvelopeType>(
    tender.requiresTechnical && tender.requiresFinancial ? "Technical" : tender.requiresFinancial ? "Quotation" : "EOI"
  );
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [coverNote, setCoverNote] = useState("");
  const [rate, setRate] = useState("");
  const [rateType, setRateType] = useState<"Daily" | "Monthly">("Daily");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);

  const open = isTenderOpen(tender);
  const canBid = supplier.status === "Active";
  const mySubs = getSubmissionsBySupplier(supplier.id).filter((s) => s.tenderRef === tender.tenderRef && !s.withdrawn);

  const envelopeOptions: EnvelopeType[] = useMemo(() => {
    if (tender.requiresTechnical && tender.requiresFinancial) return ["Technical", "Financial", "Combined"];
    if (tender.requiresTechnical) return ["Technical", "EOI"];
    if (tender.requiresFinancial) return ["Quotation", "Financial"];
    return ["EOI"];
  }, [tender]);

  async function attach() {
    setError("");
    try {
      const picked = await pickFiles({ multiple: true, uploadedBy: supplierDisplayName(supplier) });
      setFiles((f) => [...f, ...picked]);
    } catch (err) {
      setError(err instanceof FileValidationError ? err.message : "That file could not be attached.");
    }
  }

  function send() {
    setError("");
    const res = submitBid({
      tenderRef: tender.tenderRef,
      supplierId: supplier.id,
      envelope,
      documents: toTenderDocs(files),
      proposedRate: rate ? { amount: Number(rate), rateType } : undefined,
      coverNote: coverNote || undefined,
    });
    if (!res.ok) {
      setError(res.error ?? "The submission could not be accepted.");
      return;
    }
    setReceipt(res.receipt!);
    setFiles([]);
    setCoverNote("");
    setRate("");
  }

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
        <ArrowLeft className="size-4" /> Back to tenders
      </button>

      <div className={`${card} p-6`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-500">{tender.tenderRef}</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
            open ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
          }`}>
            {open ? "Open for submission" : tender.status}
          </span>
        </div>
        <h1 className="text-xl font-semibold text-slate-900">{tender.title}</h1>
        <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{tender.description}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
          <Detail label="Procurement method" value={tender.method} />
          <Detail label="Category" value={tender.category} />
          <Detail label="Closing" value={`${tender.closingDate} at ${tender.closingTime}`} />
          <Detail label="Enquiries" value={tender.contactEmail} />
        </div>
      </div>

      <div className={`${card} p-6`}>
        <h2 className="font-semibold text-slate-900 mb-3">Tender documents</h2>
        <div className="divide-y divide-slate-100">
          {tender.documents.map((d) => (
            <div key={d.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="size-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-slate-800 truncate">{d.name}</p>
                  <p className="text-xs text-slate-500">{d.type} &middot; {d.size}</p>
                </div>
              </div>
              <button
                onClick={() => (d.url ? openFile({ url: d.url, name: d.name }) : undefined)}
                disabled={!d.url}
                title={d.url ? "Open document" : "Document preview is not available in this environment"}
                className={`${btnGhost} disabled:opacity-40`}
              >
                <Download className="size-4" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {mySubs.length > 0 && (
        <div className={`${card} p-6`}>
          <h2 className="font-semibold text-slate-900 mb-3">Your submissions for this tender</h2>
          <div className="space-y-2">
            {mySubs.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {s.submissionId} &middot; {s.envelope} envelope
                  </p>
                  <p className="text-xs text-slate-500">
                    Received {new Date(s.submittedAt).toLocaleString()} &middot; {s.documents.length} document(s) &middot; ack {s.acknowledgementRef}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 ${
                    s.locked ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    <Lock className="size-3" /> {s.locked ? "Sealed" : "Opened"}
                  </span>
                  {open && (
                    <button
                      onClick={() => withdrawSubmission(s.submissionId, supplier.id)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${card} p-6`}>
        <h2 className="font-semibold text-slate-900 mb-1">Submit your bid</h2>
        <p className="text-xs text-slate-500 mb-4">
          Your submission is sealed on receipt and cannot be viewed by ACET until the official opening. You will receive
          an acknowledgement reference immediately.
        </p>

        {!canBid && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 mb-4">
            Your account status is <strong>{supplier.status}</strong>, so you cannot submit a bid at this time.
          </div>
        )}
        {!open && (
          <div className="rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-700 mb-4">
            This tender closed on {tender.closingDate} at {tender.closingTime} and is no longer accepting submissions.
          </div>
        )}
        {error && <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800 mb-4">{error}</div>}
        {receipt && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 mb-4">
            <p className="font-medium flex items-center gap-2">
              <CheckCircle2 className="size-4" /> Submission received
            </p>
            <p className="mt-1">
              Submission ID <strong>{receipt.submissionId}</strong>, acknowledgement <strong>{receipt.acknowledgementRef}</strong>,
              received {new Date(receipt.receivedAt).toLocaleString()} with {receipt.documentCount} document(s).
            </p>
          </div>
        )}

        <fieldset disabled={!open || !canBid} className="space-y-4 disabled:opacity-50">
          <Field label="Envelope">
            <div className="flex flex-wrap gap-2">
              {envelopeOptions.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEnvelope(e)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    envelope === e ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            {tender.requiresTechnical && tender.requiresFinancial && (
              <p className="text-xs text-slate-500 mt-1.5">
                Technical and financial proposals are opened at different times — submit them as separate envelopes.
              </p>
            )}
          </Field>

          {tender.requestRateQuote && supplier.type === "Individual" && (
            <Field label="Proposed consultancy rate (optional)">
              <div className="flex gap-2">
                <input
                  className={input}
                  type="number"
                  min="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="Amount in USD"
                />
                <select className={`${input} max-w-[140px]`} value={rateType} onChange={(e) => setRateType(e.target.value as "Daily" | "Monthly")}>
                  <option value="Daily">Per day</option>
                  <option value="Monthly">Per month</option>
                </select>
              </div>
            </Field>
          )}

          <Field label="Documents">
            <button type="button" onClick={attach} className={btnGhost}>
              <Upload className="size-4" /> Attach documents
            </button>
            {files.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {files.map((f) => (
                  <div key={f.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                    <button onClick={() => openFile(f)} className="text-sm text-slate-800 hover:underline truncate flex items-center gap-2">
                      <Paperclip className="size-3.5 text-slate-400" /> {f.name}
                    </button>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-500">{f.sizeLabel}</span>
                      <button onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}>
                        <X className="size-4 text-slate-400 hover:text-rose-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <Field label="Cover note (optional)">
            <textarea className={input} rows={3} value={coverNote} onChange={(e) => setCoverNote(e.target.value)} />
          </Field>

          <div className="flex justify-end">
            <button onClick={send} disabled={files.length === 0} className={btnPrimary}>
              <Send className="size-4" /> Submit sealed bid
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

function SubmissionHistory({ supplier }: { supplier: Supplier }) {
  const subs = getSubmissionsBySupplier(supplier.id);

  return (
    <div className={`${card} overflow-hidden`}>
      <div className="p-5 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">Submission history</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Every bid you have submitted, with its acknowledgement reference and timestamp.
        </p>
      </div>
      {subs.length === 0 ? (
        <p className="p-10 text-center text-sm text-slate-500">You have not submitted any bids yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {["Submission ID", "Tender", "Envelope", "Received", "Documents", "Acknowledgement", "Status"].map((h) => (
                  <th key={h} className="text-left font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subs.map((s) => (
                <tr key={s.id} className={s.withdrawn ? "opacity-50" : ""}>
                  <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{s.submissionId}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{s.tenderRef}</td>
                  <td className="px-4 py-3 text-slate-700">{s.envelope}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{new Date(s.submittedAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{s.documents.length}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{s.acknowledgementRef}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      s.withdrawn ? "bg-slate-100 text-slate-600"
                        : s.locked ? "bg-sky-100 text-sky-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {s.withdrawn ? "Withdrawn" : s.locked ? "Sealed" : "Opened"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ContractsAndInvoices({ supplier }: { supplier: Supplier }) {
  const name = supplierDisplayName(supplier);
  const contracts = getContracts().filter((c) => c.party === name);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [form, setForm] = useState({ invoiceNumber: "", amount: "", note: "" });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function attach() {
    setError("");
    try {
      const picked = await pickFiles({ multiple: true, uploadedBy: name });
      setFiles((f) => [...f, ...picked]);
    } catch (err) {
      setError(err instanceof FileValidationError ? err.message : "That file could not be attached.");
    }
  }

  function submitInvoice(contractId: string) {
    setError("");
    setSuccess("");
    const res = addInvoice(
      contractId,
      {
        invoiceNumber: form.invoiceNumber.trim(),
        supplier: name,
        amount: Number(form.amount),
        dateSubmitted: new Date().toISOString().split("T")[0],
        submittedVia: "Supplier Portal",
        documents: files.map((f) => f.name),
      },
      name
    );
    if (!res.ok) {
      setError(res.error ?? "The invoice could not be submitted.");
      return;
    }
    setSuccess(
      `Invoice ${res.invoice!.invoiceNumber} received. The contract coordinator will match it to a deliverable before it moves through approval.`
    );
    setForm({ invoiceNumber: "", amount: "", note: "" });
    setFiles([]);
    setOpenFor(null);
  }

  if (contracts.length === 0) {
    return (
      <div className={`${card} p-10 text-center text-sm text-slate-500`}>
        You have no contracts with ACET at present.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">{success}</div>
      )}
      {contracts.map((c) => {
        const invoices = c.invoices ?? [];
        const paid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + (i.amountPaid ?? i.amount), 0);
        return (
          <div key={c.id} className={`${card} p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">{c.contractNumber}</p>
                <h3 className="font-semibold text-slate-900">{c.title}</h3>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-slate-500">
                  <span>Value ${c.value.toLocaleString()}</span>
                  <span>Paid to date ${paid.toLocaleString()}</span>
                  <span>{c.startDate} → {c.endDate}</span>
                  <span>Status {c.status}</span>
                </div>
              </div>
              {c.status !== "Closed" && (
                <button onClick={() => { setOpenFor(openFor === c.id ? null : c.id); setError(""); }} className={btnPrimary}>
                  <Receipt className="size-4" /> Submit invoice
                </button>
              )}
            </div>

            {invoices.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-600 mb-2">Your invoices on this contract</p>
                <div className="space-y-1.5">
                  {invoices.map((i) => (
                    <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-50">
                      <span className="text-sm text-slate-800">{i.invoiceNumber}</span>
                      <span className="text-sm text-slate-600">${i.amount.toLocaleString()}</span>
                      <span className="text-xs text-slate-500">{i.dateSubmitted}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        i.status === "Paid" ? "bg-emerald-100 text-emerald-700"
                          : i.status === "Queried" ? "bg-rose-100 text-rose-700"
                          : "bg-sky-100 text-sky-700"
                      }`}>
                        {i.status}
                      </span>
                      {i.status === "Queried" && i.queryReason && (
                        <span className="text-xs text-rose-700 w-full">Query: {i.queryReason}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {openFor === c.id && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                {error && <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">{error}</div>}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Invoice number *">
                    <input className={input} value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} />
                  </Field>
                  <Field label="Amount (USD) *">
                    <input className={input} type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                  </Field>
                </div>
                <Field label="Invoice document">
                  <button type="button" onClick={attach} className={btnGhost}>
                    <Upload className="size-4" /> Attach invoice
                  </button>
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((f) => (
                        <p key={f.id} className="text-xs text-slate-600 flex items-center gap-1.5">
                          <Paperclip className="size-3" /> {f.name} ({f.sizeLabel})
                        </p>
                      ))}
                    </div>
                  )}
                </Field>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setOpenFor(null)} className={btnGhost}>Cancel</button>
                  <button
                    onClick={() => submitInvoice(c.id)}
                    disabled={!form.invoiceNumber.trim() || !form.amount}
                    className={btnPrimary}
                  >
                    <Send className="size-4" /> Submit invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProfileTab({ supplier }: { supplier: Supplier }) {
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const flags = getSupplierFlags(supplier);

  const editable: { key: string; label: string; current: string }[] =
    supplier.type === "Firm"
      ? [
          { key: "email", label: "Email address", current: supplier.email },
          { key: "phone", label: "Phone number", current: supplier.phone },
          { key: "registeredAddress", label: "Registered address", current: supplier.registeredAddress },
          { key: "contactPerson", label: "Contact person", current: supplier.contactPerson },
          { key: "bankName", label: "Bank name", current: supplier.bankName },
        ]
      : [
          { key: "contactEmail", label: "Email address", current: supplier.contactEmail },
          { key: "contactPhone", label: "Phone number", current: supplier.contactPhone },
          { key: "residentialAddress", label: "Residential address", current: supplier.residentialAddress },
          { key: "bankName", label: "Bank name", current: supplier.bankName },
        ];

  async function uploadDoc(docLabel: string) {
    setUploadError("");
    try {
      const files = await pickFiles({ multiple: false, uploadedBy: supplierDisplayName(supplier) });
      if (!files.length) return;
      const expiry = window.prompt(`Expiry date for "${docLabel}" (YYYY-MM-DD), or leave blank if it does not expire:`) ?? "";
      addSupplierDocument(supplier.id, { label: docLabel, expiry: expiry.trim() || undefined }, supplierDisplayName(supplier));
      setMessage(`${docLabel} uploaded. Procurement will verify it.`);
    } catch (err) {
      setUploadError(err instanceof FileValidationError ? err.message : "That file could not be attached.");
    }
  }

  function submit() {
    const res = requestProfileUpdate({ supplierId: supplier.id, fields: changes, note });
    setMessage(res.ok ? "Your changes have been sent to Procurement for review." : res.error ?? "");
    if (res.ok) {
      setChanges({});
      setNote("");
    }
  }

  const requiredDocs = supplier.type === "Firm" ? FIRM_DOC_CHECKLIST : INDIVIDUAL_DOC_CHECKLIST;

  return (
    <div className="space-y-5">
      {message && <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">{message}</div>}

      <div className={`${card} p-6`}>
        <h2 className="font-semibold text-slate-900 mb-1">Request a profile change</h2>
        <p className="text-xs text-slate-500 mb-4">
          Changes do not take effect immediately — Procurement reviews the submitted information before your record is
          updated.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {editable.map((f) => (
            <Field key={f.key} label={f.label}>
              <input
                className={input}
                defaultValue={f.current}
                onChange={(e) =>
                  setChanges((c) => {
                    const next = { ...c };
                    if (e.target.value === f.current) delete next[f.key];
                    else next[f.key] = e.target.value;
                    return next;
                  })
                }
              />
            </Field>
          ))}
        </div>
        <div className="mt-4">
          <Field label="Note to Procurement">
            <textarea className={input} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={submit} disabled={Object.keys(changes).length === 0} className={btnPrimary}>
            <Send className="size-4" /> Submit for review
          </button>
        </div>
      </div>

      <div className={`${card} p-6`}>
        <h2 className="font-semibold text-slate-900 mb-1">Compliance documents</h2>
        <p className="text-xs text-slate-500 mb-4">Keep these current to remain eligible for solicitations.</p>
        {uploadError && <p className="text-xs text-rose-600 mb-3">{uploadError}</p>}
        <div className="space-y-2">
          {requiredDocs.map((d) => {
            const held = supplier.documents.includes(d);
            const expiry = supplier.documentExpiry[d];
            const expired = flags.expiredDocs.includes(d);
            const expiring = flags.expiringDocs.find((x) => x.doc === d);
            return (
              <div key={d} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200">
                <div>
                  <p className="text-sm text-slate-800">{d}</p>
                  <p className="text-xs text-slate-500">
                    {!held ? "Not provided" : expiry ? `Valid until ${expiry}` : "On file"}
                    {expired && <span className="text-rose-600 font-medium"> — expired</span>}
                    {expiring && <span className="text-amber-600 font-medium"> — expires in {expiring.daysLeft} days</span>}
                  </p>
                </div>
                <button onClick={() => uploadDoc(d)} className={btnGhost}>
                  <Upload className="size-4" /> {held ? "Replace" : "Upload"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {(supplier.evaluations?.length ?? 0) > 0 && (
        <div className={`${card} p-6`}>
          <h2 className="font-semibold text-slate-900 mb-3">Your performance record</h2>
          <div className="space-y-2">
            {supplier.evaluations!.map((e) => (
              <div key={e.id} className="p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{e.contractTitle}</p>
                    <p className="text-xs text-slate-500">{e.contractNumber} &middot; {e.evaluationType} &middot; {e.evaluationDate}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-sm font-semibold ${
                    e.overallScore >= 8 ? "bg-emerald-100 text-emerald-700"
                      : e.overallScore >= 5 ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                  }`}>
                    {e.overallScore}/10
                  </span>
                </div>
                {e.comments && <p className="text-xs text-slate-600 mt-2">{e.comments}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationsTab({ supplier }: { supplier: Supplier }) {
  const items = getNotifications({ name: supplierDisplayName(supplier) });

  return (
    <div className={`${card} overflow-hidden`}>
      <div className="p-5 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">Notifications</h2>
      </div>
      {items.length === 0 ? (
        <p className="p-10 text-center text-sm text-slate-500">You have no notifications.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${n.read ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">{n.subject}</p>
                <span className="text-xs text-slate-400 shrink-0">{new Date(n.sentAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">{n.body}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Small shared pieces
   ──────────────────────────────────────────────────────────────────────────── */

function Field({ label: text, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className={label}>{text}</span>
      {children}
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}

function Detail({ label: text, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{text}</p>
      <p className="text-sm text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: Supplier["status"] }) {
  const tone =
    status === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Pending Onboarding" || status === "Pending Reactivation"
        ? "bg-sky-100 text-sky-700"
        : status === "Flagged"
          ? "bg-amber-100 text-amber-700"
          : "bg-rose-100 text-rose-700";
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tone}`}>{status}</span>;
}
