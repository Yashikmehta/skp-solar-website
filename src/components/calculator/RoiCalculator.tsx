'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Cta } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ANCHORS } from '@/lib/routes';
import {
  calculateRoi,
  chartGeometry,
  formatInr,
  STATES,
  type PropertyType,
  type StateKey,
} from '@/lib/calculator';

const PROPERTY_TYPES: { key: PropertyType; label: string }[] = [
  { key: 'res', label: 'Residential' },
  { key: 'com', label: 'Commercial' },
  { key: 'ind', label: 'Industrial' },
];

/** Gauge circumference for r=54, as in the approved SVG. */
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 54;

/** easeOutCubic, matching `animNum()` in the approved page. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Animates a number between renders exactly as `animNum()` did: 750 ms,
 * easeOutCubic, and an instant jump under reduced motion.
 */
function useAnimatedNumber(target: number, reduced: boolean) {
  const [value, setValue] = useState(target);
  const previous = useRef(target);

  useEffect(() => {
    const from = previous.current;
    previous.current = target;

    if (reduced || from === target) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / 750, 1);
      setValue(from + (target - from) * ease(progress));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, reduced]);

  return value;
}

interface RoiCalculatorProps {
  /** `.roi` on Home, `.calc` on the Calculator page. */
  sectionClassName?: string;
  id?: string;
  /** Rendered above the calculator; omit on pages with their own heading. */
  heading?: boolean;
  /** CTA under the results panel. */
  ctaLabel?: string;
  ctaHref?: string;
  /** Fineprint under the panel. */
  fineprint?: string;
  /** Notifies the page of the current estimate (used for lead capture). */
  onEstimate?: (estimate: {
    systemKw: number;
    monthlySavings: number;
    paybackYears: number;
  }) => void;
}

/**
 * `.roi` — the solar ROI calculator (Home and the Calculator page).
 *
 * Inputs, ranges, steps, defaults, output copy and the chart geometry are all
 * the approved ones. The maths lives in `src/lib/calculator.ts`, ported
 * verbatim from `initROI()`.
 */
export function RoiCalculator({
  sectionClassName = 'roi',
  id = 'calculator',
  heading = true,
  ctaLabel = 'Get my detailed savings report',
  ctaHref = ANCHORS.enquiry,
  fineprint = 'Indicative estimates based on conservative assumptions (0.78 performance ratio, ~0.6%/yr degradation, 3%/yr tariff escalation, grid emission factor 0.71 kg CO₂/kWh). Your SKP engineer will confirm exact figures after a site survey.',
  onEstimate,
}: RoiCalculatorProps) {
  const reduced = usePrefersReducedMotion();

  const [bill, setBill] = useState(25000);
  const [roof, setRoof] = useState(2000);
  const [tariff, setTariff] = useState(7.5);
  const [state, setState] = useState<StateKey>('pb');
  const [propertyType, setPropertyType] = useState<PropertyType>('res');

  const result = useMemo(
    () =>
      calculateRoi({
        monthlyBill: bill,
        roofSqFt: roof,
        tariff,
        state,
        propertyType,
      }),
    [bill, roof, tariff, state, propertyType],
  );

  useEffect(() => {
    onEstimate?.({
      systemKw: result.sizeKw,
      monthlySavings: Math.round(result.monthlySavings),
      paybackYears: Number(result.paybackYears.toFixed(1)),
    });
  }, [result, onEstimate]);

  const size = useAnimatedNumber(result.sizeKw, reduced);
  const savings = useAnimatedNumber(result.monthlySavings, reduced);
  const payback = useAnimatedNumber(result.paybackYears, reduced);
  const savings25 = useAnimatedNumber(result.savings25, reduced);
  const co2 = useAnimatedNumber(result.co2Tonnes, reduced);

  const geometry = useMemo(
    () => chartGeometry(result.cumulative, result.breakevenYear),
    [result],
  );

  /** `--fill` drives the gradient track on `.rng`. */
  const fill = (value: number, min: number, max: number) =>
    ({ '--fill': `${(((value - min) / (max - min)) * 100).toFixed(1)}%` }) as React.CSSProperties;

  const gaugeOffset = (GAUGE_CIRCUMFERENCE * (1 - Math.min(result.offset, 1))).toFixed(1);

  return (
    <section className={sectionClassName} id={id}>
      <AmbientOrb
        tone="green"
        parallax={-0.05}
        style={{ width: 360, height: 360, top: 40, right: -80 }}
      />
      <AmbientOrb
        tone="gold"
        parallax={0.05}
        style={{ width: 300, height: 300, bottom: 0, left: -70 }}
      />

      <div className="wrap">
        {heading ? (
          <SectionHeading
            className="reveal"
            kicker="Solar ROI Calculator"
            title={
              <>
                See your <Hl>savings</Hl> before you commit
              </>
            }
            body="Adjust the numbers that match your site. We’ll size the system and model returns on conservative, real-world assumptions for India."
          />
        ) : null}

        <div className="roi-wrap">
          {/* ---------- Inputs ---------- */}
          <div className="roi-inputs reveal-x">
            <h3>
              <Icon name="sliders" /> Your details
            </h3>

            <div className="roi-field">
              <div className="roi-field-top">
                <label htmlFor="roiBill">Monthly electricity bill</label>
                <span className="roi-val">{formatInr(bill)}</span>
              </div>
              <input
                id="roiBill"
                type="range"
                className="rng"
                min={2000}
                max={500000}
                step={1000}
                value={bill}
                style={fill(bill, 2000, 500000)}
                onChange={(event) => setBill(Number(event.target.value))}
              />
            </div>

            <div className="roi-field">
              <div className="roi-field-top">
                <label>Property type</label>
              </div>
              <div className="seg">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type.key}
                    className={propertyType === type.key ? 'active' : undefined}
                    aria-pressed={propertyType === type.key}
                    onClick={() => setPropertyType(type.key)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="roi-field">
              <div className="roi-field-top">
                <label htmlFor="roiRoof">Available roof size</label>
                <span className="roi-val">{roof.toLocaleString('en-IN')} sq ft</span>
              </div>
              <input
                id="roiRoof"
                type="range"
                className="rng"
                min={200}
                max={50000}
                step={100}
                value={roof}
                style={fill(roof, 200, 50000)}
                onChange={(event) => setRoof(Number(event.target.value))}
              />
            </div>

            <div className="roi-field">
              <div className="roi-field-top">
                <label htmlFor="roiState">State / location</label>
              </div>
              <select
                id="roiState"
                className="roi-select"
                value={state}
                onChange={(event) => {
                  const next = event.target.value as StateKey;
                  setState(next);
                  /* Selecting a state resets the tariff to that state's default. */
                  setTariff(STATES[next].tariff);
                }}
              >
                {Object.entries(STATES).map(([key, profile]) => (
                  <option value={key} key={key}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="roi-field" style={{ marginBottom: 0 }}>
              <div className="roi-field-top">
                <label htmlFor="roiTariff">Electricity tariff</label>
                <span className="roi-val">₹{tariff.toFixed(1)} / kWh</span>
              </div>
              <input
                id="roiTariff"
                type="range"
                className="rng"
                min={4}
                max={15}
                step={0.1}
                value={tariff}
                style={fill(tariff, 4, 15)}
                onChange={(event) => setTariff(Number(event.target.value))}
              />
            </div>
          </div>

          {/* ---------- Output ---------- */}
          <div className="roi-out reveal dly2">
            <div className="roi-out-top">
              <div className="roi-gauge-wrap">
                <svg className="roi-gauge" viewBox="0 0 128 128" aria-hidden="true">
                  <defs>
                    <linearGradient id="ggrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffb838" />
                      <stop offset="1" stopColor="#f4a52a" />
                    </linearGradient>
                  </defs>
                  <circle className="track" cx="64" cy="64" r="54" />
                  <circle
                    className="arc"
                    cx="64"
                    cy="64"
                    r="54"
                    style={{ strokeDashoffset: gaugeOffset }}
                  />
                </svg>
                <div className="roi-gauge-c">
                  <span className="sz">{size.toFixed(1)}</span>
                  <span className="u">kW SYSTEM</span>
                </div>
              </div>
              <div className="roi-out-lead">
                <div className="lab">Recommended for you</div>
                <div className="big">
                  A <b>{result.sizeKw.toFixed(1)} kW</b> rooftop solar plant
                </div>
                <div className="off">
                  covers {Math.round(result.offset * 100)}% of your annual usage
                </div>
              </div>
            </div>

            <div className="roi-kpis">
              <div className="roi-kpi hi">
                <div className="v">{formatInr(savings)}</div>
                <div className="k">Estimated monthly savings</div>
              </div>
              <div className="roi-kpi">
                <div className="v">{payback.toFixed(1)} yrs</div>
                <div className="k">Payback period</div>
              </div>
              <div className="roi-kpi hi">
                <div className="v">{formatInr(savings25)}</div>
                <div className="k">Net savings over 25 years</div>
              </div>
              <div className="roi-kpi">
                <div className="v">{co2.toFixed(0)} t</div>
                <div className="k">CO₂ avoided (25 yrs)</div>
              </div>
            </div>

            <div className="roi-chart-box">
              <div className="roi-chart-head">
                <b>Cumulative net savings</b>
                <span>Breakeven — yr {result.breakevenYear.toFixed(1)}</span>
              </div>
              <svg
                className="roi-chart"
                viewBox="0 0 460 128"
                preserveAspectRatio="none"
                role="img"
                aria-label={`Cumulative net savings reaching breakeven in year ${result.breakevenYear.toFixed(
                  1,
                )}`}
              >
                <defs>
                  <linearGradient id="agrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffb838" stopOpacity="0.38" />
                    <stop offset="1" stopColor="#ffb838" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line className="zero" x1="8" y1={geometry.zeroY} x2="452" y2={geometry.zeroY} />
                <path className="ar" d={geometry.area} />
                <line
                  className="pb"
                  x1={geometry.paybackX}
                  y1="6"
                  x2={geometry.paybackX}
                  y2="122"
                />
                <path className="ln" d={geometry.line} />
                <circle className="pbdot" cx={geometry.paybackX} cy={geometry.zeroY} r="3.4" />
              </svg>
              <div className="roi-xlabels">
                <span>Today</span>
                <span>Year 12</span>
                <span>Year 25</span>
              </div>
            </div>

            <Cta href={ctaHref} className="roi-cta">
              {ctaLabel}
            </Cta>
          </div>
        </div>

        {fineprint ? <p className="roi-fineprint">{fineprint}</p> : null}
      </div>
    </section>
  );
}
