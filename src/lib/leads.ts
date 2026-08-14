/**
 * Lead capture — shared types and validation.
 *
 * HANDOFF.md §5: "both forms validate and have success states but persist to
 * localStorage (`skp_enquiries`) as a design stub. Wire to the real
 * endpoint/CRM." That stub is replaced by `POST /api/leads`; the validation
 * rules below are the ones the approved forms enforced, and they now run on
 * both the client (for inline field errors) and the server (for trust).
 */

export const SECTORS = ['Residential', 'Commercial', 'Industrial', 'School'] as const;
export type Sector = (typeof SECTORS)[number];

export type LeadSource = 'Contact Page' | 'Calculator Page';

/**
 * The full calculator context attached to a Solar Calculator lead: the inputs
 * the visitor gave, the sizing that came out, and every headline figure the
 * report showed them. Sent so the sales team sees exactly the numbers the
 * customer saw, without having to re-run anything.
 */
export interface CalculatorEstimate {
  /** Input: average monthly electricity bill, ₹ */
  monthlyBill: number;
  /** Output: recommended system size, kW */
  systemKw: number;
  /** Output: units generated per month, kWh */
  monthlyGeneration: number;
  monthlySavings: number;
  annualSavings: number;
  /** Net cumulative savings at year 25, ₹ */
  savings25: number;
  /** System capital cost, ₹ */
  systemCost: number;
  paybackYears: number;
  /** Tonnes of CO₂ avoided over 25 years */
  co2Tonnes: number;
  /** Equivalent trees planted */
  trees: number;
  /** Share of the bill offset, 0–1.2 */
  billOffset: number;
}

export interface LeadPayload {
  name: string;
  company?: string;
  mobile: string;
  email: string;
  city: string;
  sector: string;
  message?: string;
  source: LeadSource;
  /** Present only on Solar Calculator leads. */
  estimate?: CalculatorEstimate;
}

/** Numeric fields of `CalculatorEstimate`, in the order the email lists them. */
const ESTIMATE_KEYS: (keyof CalculatorEstimate)[] = [
  'monthlyBill',
  'systemKw',
  'monthlyGeneration',
  'monthlySavings',
  'annualSavings',
  'savings25',
  'systemCost',
  'paybackYears',
  'co2Tonnes',
  'trees',
  'billOffset',
];

/**
 * Coerce an untrusted `estimate` object into a `CalculatorEstimate`.
 *
 * The estimate arrives from the browser, so it is never trusted as-is: every
 * field must be a finite number or the whole estimate is dropped (the lead
 * itself still saves — losing the numbers must never lose the customer).
 */
export function sanitizeEstimate(input: unknown): CalculatorEstimate | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const source = input as Record<string, unknown>;
  const output = {} as CalculatorEstimate;

  for (const key of ESTIMATE_KEYS) {
    const value = source[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
    output[key] = value;
  }

  return output;
}

export type LeadErrors = Partial<Record<keyof LeadPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Digits only, so "+91 98765 43210" and "9876543210" both validate. */
export function digitsOf(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validation rules, ported from `handleSubmit()` in the approved pages:
 * name required · mobile ≥ 10 digits · valid email · city required ·
 * sector required. Company and message stay optional.
 */
export function validateLead(input: Partial<LeadPayload>): LeadErrors {
  const errors: LeadErrors = {};

  if (!input.name?.trim()) {
    errors.name = 'Please enter your name';
  }
  if (digitsOf(input.mobile ?? '').length < 10) {
    errors.mobile = 'Please enter a valid mobile number';
  }
  if (!EMAIL_RE.test(input.email?.trim() ?? '')) {
    errors.email = 'Please enter a valid email address';
  }
  if (!input.city?.trim()) {
    errors.city = 'Please enter your city';
  }
  if (!input.sector) {
    errors.sector = 'Please select a sector';
  }

  return errors;
}

export function hasErrors(errors: LeadErrors): boolean {
  return Object.keys(errors).length > 0;
}
