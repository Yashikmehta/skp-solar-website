/**
 * ============================================================================
 * SOLAR ROI ENGINE
 * ============================================================================
 * Ported verbatim from `initROI()` in SKP-Home.dc.html. Every constant and
 * every formula below is the approved one — the numbers the calculator shows
 * must not move.
 *
 * HANDOFF.md §5 flags these assumptions as *config, not content*, and §8 lists
 * "signed-off calculator assumptions" as still needed from the client. They are
 * isolated here so they can move to CMS settings without touching the maths.
 * ============================================================================
 */

export interface StateProfile {
  /** Display name */
  name: string;
  /** Peak sun hours per day */
  sun: number;
  /** Default tariff, ₹ per kWh */
  tariff: number;
}

/** State solar-yield and tariff profiles. */
export const STATES: Record<string, StateProfile> = {
  pb: { name: 'Punjab', sun: 4.9, tariff: 7.5 },
  hr: { name: 'Haryana', sun: 4.9, tariff: 7.2 },
  dl: { name: 'Delhi NCR', sun: 4.8, tariff: 8.0 },
  up: { name: 'Uttar Pradesh', sun: 4.7, tariff: 7.5 },
  rj: { name: 'Rajasthan', sun: 5.7, tariff: 7.2 },
  gj: { name: 'Gujarat', sun: 5.4, tariff: 7.0 },
  mh: { name: 'Maharashtra', sun: 5.0, tariff: 9.5 },
  ka: { name: 'Karnataka', sun: 5.2, tariff: 8.0 },
  tn: { name: 'Tamil Nadu', sun: 5.3, tariff: 7.8 },
  ts: { name: 'Telangana', sun: 5.3, tariff: 8.5 },
};

export type StateKey = keyof typeof STATES;
export type PropertyType = 'res' | 'com' | 'ind';

/** Installed cost, ₹ per kW, by property type. */
export const COST_PER_KW: Record<PropertyType, number> = {
  res: 62000,
  com: 52000,
  ind: 46000,
};

/** Roof area required, sq ft per kW, by property type. */
export const AREA_PER_KW: Record<PropertyType, number> = {
  res: 90,
  com: 85,
  ind: 80,
};

/** Performance ratio. */
export const PERFORMANCE_RATIO = 0.78;
/** Grid emission factor, kg CO₂ per kWh. */
export const CO2_PER_KWH = 0.71;
/** Annual module degradation retention factor (0.6 %/yr loss). */
export const DEGRADATION = 0.994;
/** Annual tariff escalation. */
export const TARIFF_ESCALATION = 1.03;
/** Exported surplus is credited at half the retail tariff. */
export const SURPLUS_CREDIT = 0.5;
/** Projection horizon, years. */
export const HORIZON_YEARS = 25;

export interface CalculatorInput {
  /** Monthly electricity bill in ₹ */
  monthlyBill: number;
  /** Available roof area in sq ft */
  roofSqFt: number;
  /** ₹ per kWh */
  tariff: number;
  state: StateKey;
  propertyType: PropertyType;
}

export interface CalculatorResult {
  /** Recommended system size in kW, rounded to the nearest 0.5 */
  sizeKw: number;
  /** Share of annual usage covered, capped at 1.2 as in the design */
  offset: number;
  monthlySavings: number;
  annualSavings: number;
  /** Simple payback (capex ÷ annual savings) — the "Payback period" KPI */
  paybackYears: number;
  /** Interpolated breakeven from the 25-year simulation — the chart label */
  breakevenYear: number;
  /** Net cumulative savings at year 25 */
  savings25: number;
  /** Tonnes of CO₂ avoided over 25 years */
  co2Tonnes: number;
  /** System capital cost in ₹ */
  capex: number;
  /** Cumulative net cashflow, index 0 = today (−capex) through year 25 */
  cumulative: number[];
}

/**
 * The approved calculation, unchanged.
 *
 * System size is the lesser of what the bill needs and what the roof allows,
 * floored at 1 kW and rounded to the nearest half kW. Savings credit
 * self-consumed units at the full tariff and exported surplus at half.
 */
export function calculateRoi({
  monthlyBill,
  roofSqFt,
  tariff,
  state,
  propertyType,
}: CalculatorInput): CalculatorResult {
  const profile = STATES[state] ?? STATES.pb;

  const monthlyUnits = monthlyBill / tariff;
  const annualConsumption = monthlyUnits * 12;
  const dailyUnits = monthlyUnits / 30;

  const sizeNeeded = dailyUnits / (profile.sun * PERFORMANCE_RATIO);
  const sizeByRoof = roofSqFt / AREA_PER_KW[propertyType];
  let sizeKw = Math.min(sizeNeeded, sizeByRoof);
  sizeKw = Math.max(1, Math.round(sizeKw * 2) / 2);

  const annualGen = sizeKw * profile.sun * 365 * PERFORMANCE_RATIO;
  const selfUse = Math.min(annualGen, annualConsumption);
  const surplus = Math.max(annualGen - annualConsumption, 0);
  const annualSavings = selfUse * tariff + surplus * tariff * SURPLUS_CREDIT;
  const monthlySavings = annualSavings / 12;
  const capex = sizeKw * COST_PER_KW[propertyType];
  const offset = Math.min(annualGen / annualConsumption, 1.2);

  /* 25-year simulation with degradation and tariff escalation. */
  let cum = -capex;
  const cumulative = [cum];
  let totalGen = 0;
  let breakevenYear = HORIZON_YEARS;

  for (let year = 1; year <= HORIZON_YEARS; year += 1) {
    const gen = annualGen * Math.pow(DEGRADATION, year - 1);
    const yearTariff = tariff * Math.pow(TARIFF_ESCALATION, year - 1);
    const su = Math.min(gen, annualConsumption);
    const sp = Math.max(gen - annualConsumption, 0);
    const previous = cum;
    cum += su * yearTariff + sp * yearTariff * SURPLUS_CREDIT;
    cumulative.push(cum);
    totalGen += gen;
    if (breakevenYear === HORIZON_YEARS && cum >= 0 && previous < 0) {
      breakevenYear = year - 1 + (0 - previous) / (cum - previous);
    }
  }

  return {
    sizeKw,
    offset,
    monthlySavings,
    annualSavings,
    paybackYears: capex / annualSavings,
    breakevenYear,
    savings25: cum,
    co2Tonnes: (totalGen * CO2_PER_KWH) / 1000,
    capex,
    cumulative,
  };
}

/** ₹ formatting used across the calculator UI, ported verbatim. */
export function formatInr(value: number): string {
  const v = Math.round(value);
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
}

/* ==========================================================================
   SPREADSHEET ROI ENGINE — /solar-calculator
   ==========================================================================
   The Calculator page runs a *different*, simpler model from the homepage
   widget: the constants come straight from "ROI calculator.xlsx" and it sizes
   the plant from the bill alone (no roof or state input).

   Both engines are approved and both are kept, exactly as handed off. Do not
   merge them — they answer different questions and their published fineprint
   differs. HANDOFF.md §8 lists sign-off on these assumptions as outstanding.
   ========================================================================== */

/** Units generated per kW per day (spreadsheet cell B). */
export const SHEET_UNITS_PER_KW_DAY = 4;
/** ₹ per unit, 6.60 + taxes (cell D). */
export const SHEET_RATE_PER_UNIT = 8.85;
/** Project cost, ₹ per kW (cell F). */
export const SHEET_COST_PER_KW = 31500;
/** Tariff escalation per year. */
export const SHEET_ESCALATION = 0.03;
/** Panel degradation per year. */
export const SHEET_DEGRADE = 0.006;
/** kg CO₂ per kWh of grid power. */
export const SHEET_CO2_PER_UNIT = 0.71;
/** kg CO₂ absorbed by one tree over 25 years. */
export const TREE_LIFETIME_KG = 21.77 * 25;

export interface ReportResult {
  sizeKw: number;
  monthlyGeneration: number;
  monthlySavings: number;
  annualSavings: number;
  cost: number;
  paybackYears: number;
  savings25: number;
  co2Tonnes: number;
  trees: number;
  offset: number;
  cumulative: number[];
  breakevenYear: number;
}

/** The approved spreadsheet calculation, ported verbatim from `compute()`. */
export function calculateReport(monthlyBill: number): ReportResult {
  const monthlyUnits = monthlyBill / SHEET_RATE_PER_UNIT;
  const sizeRaw = monthlyUnits / (SHEET_UNITS_PER_KW_DAY * 30);
  const sizeKw = Math.max(1, Math.round(sizeRaw * 2) / 2);

  const monthlyGeneration = sizeKw * SHEET_UNITS_PER_KW_DAY * 30;
  const monthlySavings = monthlyGeneration * SHEET_RATE_PER_UNIT;
  const annualSavings = monthlySavings * 12;
  const cost = sizeKw * SHEET_COST_PER_KW;
  const paybackYears = cost / monthlySavings / 12;
  const offset = Math.min(monthlyGeneration / monthlyUnits, 1.2);

  let cum = -cost;
  const cumulative = [cum];
  let totalUnits = 0;
  let breakevenYear = HORIZON_YEARS;

  for (let year = 1; year <= HORIZON_YEARS; year += 1) {
    const gen = monthlyGeneration * 12 * Math.pow(1 - SHEET_DEGRADE, year - 1);
    const rate = SHEET_RATE_PER_UNIT * Math.pow(1 + SHEET_ESCALATION, year - 1);
    const previous = cum;
    cum += gen * rate;
    cumulative.push(cum);
    totalUnits += gen;
    if (breakevenYear === HORIZON_YEARS && cum >= 0 && previous < 0) {
      breakevenYear = year - 1 + (0 - previous) / (cum - previous);
    }
  }

  return {
    sizeKw,
    monthlyGeneration,
    monthlySavings,
    annualSavings,
    cost,
    paybackYears,
    savings25: cum,
    co2Tonnes: (totalUnits * SHEET_CO2_PER_UNIT) / 1000,
    trees: Math.round((totalUnits * SHEET_CO2_PER_UNIT) / TREE_LIFETIME_KG),
    offset,
    cumulative,
    breakevenYear,
  };
}

export interface ChartGeometry {
  line: string;
  area: string;
  zeroY: number;
  paybackX: number;
}

/**
 * Chart path geometry for the cumulative-savings graph.
 * Viewport and padding match the approved SVG (460×128, 8px pad).
 */
export function chartGeometry(
  points: number[],
  paybackYear: number,
  width = 460,
  height = 128,
  pad = 8,
): ChartGeometry {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const x = (i: number) => pad + (i / (points.length - 1)) * (width - 2 * pad);
  const y = (v: number) => height - pad - ((v - min) / range) * (height - 2 * pad);

  const line = `M${points.map((v, i) => `${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' L')}`;
  const bottom = (height - pad).toFixed(1);
  const area = `${line} L${x(points.length - 1).toFixed(1)} ${bottom} L${x(0).toFixed(
    1,
  )} ${bottom} Z`;

  return {
    line,
    area,
    zeroY: Number(y(0).toFixed(1)),
    paybackX: Number(x(Math.min(paybackYear, points.length - 1)).toFixed(1)),
  };
}
