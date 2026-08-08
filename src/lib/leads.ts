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

export interface LeadPayload {
  name: string;
  company?: string;
  mobile: string;
  email: string;
  city: string;
  sector: string;
  message?: string;
  source: LeadSource;
  /** Optional calculator context, attached by the calculator lead form. */
  estimate?: {
    systemKw: number;
    monthlySavings: number;
    paybackYears: number;
  };
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
