// ──────────────────────────────────────────────────────────────────────────────
// Procurement method thresholds.
//
// "System suggests procurement method based on: Estimated value... Procurement
// should be able to override the procurement method or input it directly."
//
// The four methods below are the ones the requirements name throughout Sourcing
// (RFQ, Open, Limited, Direct). The rest of the codebase grew a second, older
// vocabulary — "Competitive Bidding", "Single Source", "Direct Purchase" — so
// `canonicalMethod` folds those into the official four rather than leaving two
// incompatible sets of strings flowing between Planning, Requisitions and
// Sourcing.
// ──────────────────────────────────────────────────────────────────────────────

export type ProcurementMethod =
  | "Request for Quotation"
  | "Open Competition"
  | "Limited Competition"
  | "Direct Selection";

export const PROCUREMENT_METHODS: ProcurementMethod[] = [
  "Request for Quotation",
  "Open Competition",
  "Limited Competition",
  "Direct Selection",
];

export interface MethodThreshold {
  method: ProcurementMethod;
  minValue: number;
  /** Exclusive upper bound; Infinity for the top band. */
  maxValue: number;
  requiresJustification: boolean;
  note: string;
}

/**
 * Default bands in USD. ACET's finance manual supplies the authoritative
 * figures; these are held in one place so a change is a single edit rather
 * than a hunt through the components.
 */
export const METHOD_THRESHOLDS: MethodThreshold[] = [
  {
    method: "Direct Selection",
    minValue: 0,
    maxValue: 5_000,
    requiresJustification: true,
    note: "Low-value or sole-source procurement. A written justification is mandatory at any value.",
  },
  {
    method: "Request for Quotation",
    minValue: 5_000,
    maxValue: 50_000,
    requiresJustification: false,
    note: "At least three written quotations from known suppliers.",
  },
  {
    method: "Limited Competition",
    minValue: 50_000,
    maxValue: 200_000,
    requiresJustification: true,
    note: "Invitation to a shortlist. Justify why the market was restricted.",
  },
  {
    method: "Open Competition",
    minValue: 200_000,
    maxValue: Infinity,
    requiresJustification: false,
    note: "Publicly advertised tender open to all qualified bidders.",
  },
];

/** Requisitions above this value route to Senior Management for final approval. */
export const SENIOR_APPROVAL_THRESHOLD = 10_000;

/** Purchase orders at or above this value must be signed by the COO. */
export const COO_SIGNATURE_THRESHOLD = 10_000;

const LEGACY_METHOD_ALIASES: Record<string, ProcurementMethod> = {
  rfq: "Request for Quotation",
  "request for quotation": "Request for Quotation",
  "request for quotations": "Request for Quotation",
  quotation: "Request for Quotation",
  "competitive bidding": "Open Competition",
  "open competition": "Open Competition",
  open: "Open Competition",
  "national competitive bidding": "Open Competition",
  "international competitive bidding": "Open Competition",
  "limited competition": "Limited Competition",
  limited: "Limited Competition",
  "restricted tender": "Limited Competition",
  "framework agreement": "Limited Competition",
  "direct selection": "Direct Selection",
  "direct purchase": "Direct Selection",
  direct: "Direct Selection",
  "single source": "Direct Selection",
  "sole source": "Direct Selection",
};

/** Maps any legacy or free-text method onto the four official methods. */
export function canonicalMethod(method: string | undefined | null): ProcurementMethod {
  if (!method) return "Request for Quotation";
  const hit = LEGACY_METHOD_ALIASES[method.trim().toLowerCase()];
  return hit ?? "Request for Quotation";
}

/** The method the thresholds point to for a given estimated value. */
export function suggestProcurementMethod(estimatedValue: number): ProcurementMethod {
  const band = METHOD_THRESHOLDS.find((t) => estimatedValue >= t.minValue && estimatedValue < t.maxValue);
  return band?.method ?? "Open Competition";
}

export function getThreshold(method: ProcurementMethod): MethodThreshold | undefined {
  return METHOD_THRESHOLDS.find((t) => t.method === method);
}

export function formatBand(t: MethodThreshold): string {
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (t.maxValue === Infinity) return `above ${fmt(t.minValue)}`;
  if (t.minValue === 0) return `up to ${fmt(t.maxValue)}`;
  return `${fmt(t.minValue)} – ${fmt(t.maxValue)}`;
}

export interface MethodCheck {
  compliant: boolean;
  suggested: ProcurementMethod;
  /** Populated when the chosen method sits outside its value band. */
  message?: string;
  requiresJustification: boolean;
}

/**
 * Checks a chosen method against the value band. A deviation is permitted — the
 * requirement explicitly allows Procurement to override — but it must be
 * surfaced and justified rather than silently accepted.
 */
export function validateMethodAgainstThreshold(
  method: string,
  estimatedValue: number
): MethodCheck {
  const chosen = canonicalMethod(method);
  const suggested = suggestProcurementMethod(estimatedValue);
  const band = getThreshold(chosen);
  const compliant = chosen === suggested;

  return {
    compliant,
    suggested,
    requiresJustification: band?.requiresJustification ?? false,
    message: compliant
      ? undefined
      : `${chosen} normally applies ${band ? formatBand(band) : "outside this range"}. At $${estimatedValue.toLocaleString()} the thresholds indicate ${suggested}. Record a justification for the deviation.`,
  };
}

/** Sourcing steps differ by method; this is the shared predicate set. */
export function isCompetitive(method: string): boolean {
  const m = canonicalMethod(method);
  return m === "Open Competition" || m === "Limited Competition";
}

export function isDirect(method: string): boolean {
  return canonicalMethod(method) === "Direct Selection";
}

export function isRFQ(method: string): boolean {
  return canonicalMethod(method) === "Request for Quotation";
}

/** Only Open Competition is publicly advertised. */
export function requiresAdvertisement(method: string): boolean {
  return canonicalMethod(method) === "Open Competition";
}
