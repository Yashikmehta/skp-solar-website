'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  calculateReport,
  chartGeometry,
  formatInr,
  type ReportResult,
} from '@/lib/calculator';
import { digitsOf, SECTORS, type LeadPayload } from '@/lib/leads';
import { ANCHORS } from '@/lib/routes';
import { siteSettings, telHref, waHref } from '@/lib/site';

/** Sector → the noun used in the report intro, from the approved copy. */
const SECTOR_WORD: Record<string, string> = {
  Residential: 'home',
  Commercial: 'business',
  Industrial: 'facility',
  School: 'school',
};

const svg = (children: ReactNode) => <svg viewBox="0 0 24 24">{children}</svg>;

const KPI_GLYPHS = {
  rupee: svg(<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />),
  chart: svg(
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </>,
  ),
  calendar: svg(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 4V2M16 4V2" />
    </>,
  ),
  clock: svg(
    <>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v4h-4" />
      <path d="M12 8v4l2.6 1.5" />
    </>,
  ),
  leaf: svg(
    <>
      <path d="M2 22s4-2 10-2 10 2 10 2" />
      <path d="M12 20V8" />
      <path d="M12 8c0-3 2-5 5-5-1 3-3 5-5 5zM12 12c0-2.5-2-4.5-4.5-4.5C8.5 10 10.5 12 12 12z" />
    </>,
  ),
  tree: svg(
    <>
      <path d="M12 22v-6" />
      <path d="M12 16c-4 0-6-3-6-6a6 6 0 0 1 12 0c0 3-2 6-6 6z" />
      <path d="M9 8c1 1.5 2 2.5 3 3M15 8c-1 1.5-2 2.5-3 3" />
    </>,
  ),
};

/** easeOutCubic count-up used by every report figure. */
function useReportNumber(target: number | null, reduced: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target == null) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(step);
      else setValue(target);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, reduced, duration]);

  return value;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  bill?: string;
}

/**
 * `.calc-shell` — the lead form and the personalized report it reveals.
 *
 * Validation rules, error copy, the loading state on the submit button, the
 * form → report transition and the scroll-back are all ported from the
 * approved page. The localStorage stub is replaced by `POST /api/leads`, which
 * stores the lead in Supabase and notifies sales. The report is revealed only
 * after that succeeds — an enquiry must never be silently dropped behind a
 * success state.
 */
export function SavingsReport() {
  const reduced = usePrefersReducedMotion();
  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    bill: '',
    sector: 'Residential',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  /** Set when the lead could not be stored — the report stays hidden. */
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<ReportResult | null>(null);
  const [submitted, setSubmitted] = useState<{ name: string; sector: string } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const size = useReportNumber(result?.sizeKw ?? null, reduced);
  const monthly = useReportNumber(result?.monthlySavings ?? null, reduced);
  const annual = useReportNumber(result?.annualSavings ?? null, reduced);
  const total25 = useReportNumber(result?.savings25 ?? null, reduced);
  const cost = useReportNumber(result?.cost ?? null, reduced);
  const payback = useReportNumber(result?.paybackYears ?? null, reduced);
  const co2 = useReportNumber(result?.co2Tonnes ?? null, reduced);
  const trees = useReportNumber(result?.trees ?? null, reduced);
  const generation = useReportNumber(result?.monthlyGeneration ?? null, reduced);

  const set = (key: keyof typeof values) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSubmitError('');
    setErrors((current) => {
      if (!current[key as keyof FormErrors]) return current;
      const next = { ...current };
      delete next[key as keyof FormErrors];
      return next;
    });
  };

  function validate(): FormErrors {
    const found: FormErrors = {};
    if (!values.name.trim()) found.name = 'Please enter your name';
    if (digitsOf(values.phone).length !== 10) found.phone = 'Enter a valid 10-digit number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      found.email = 'Enter a valid email address';
    }
    if (!Number(digitsOf(values.bill))) found.bill = 'Enter your average monthly bill';
    return found;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    const bill = Number(digitsOf(values.bill));
    const computed = calculateReport(bill);
    setLoading(true);
    setSubmitError('');

    /* The full calculator context travels with the lead: the visitor's input,
       the sizing it produced, and every headline figure the report will show
       them — so sales sees exactly the numbers the customer saw. */
    const payload: Partial<LeadPayload> = {
      name: values.name.trim(),
      mobile: `+91${digitsOf(values.phone)}`,
      email: values.email.trim(),
      city: '—',
      sector: values.sector,
      source: 'Calculator Page',
      estimate: {
        monthlyBill: bill,
        systemKw: computed.sizeKw,
        monthlyGeneration: computed.monthlyGeneration,
        monthlySavings: computed.monthlySavings,
        annualSavings: computed.annualSavings,
        savings25: computed.savings25,
        systemCost: computed.cost,
        paybackYears: computed.paybackYears,
        co2Tonnes: computed.co2Tonnes,
        trees: computed.trees,
        billOffset: computed.offset,
      },
    };

    /* The report is only revealed once the lead is safely stored — an enquiry
       must never be silently dropped. The 650 ms floor keeps the approved
       loading animation from flashing on a fast connection. */
    const minimumDelay = new Promise((resolve) => window.setTimeout(resolve, 650));

    try {
      const [response] = await Promise.all([
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        minimumDelay,
      ]);

      const data = (await response.json().catch(() => ({ ok: false }))) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        setLoading(false);
        setSubmitError(
          data.message ?? 'We could not submit your enquiry. Please call or WhatsApp us.',
        );
        return;
      }
    } catch {
      await minimumDelay;
      setLoading(false);
      setSubmitError('We could not submit your enquiry. Please call or WhatsApp us.');
      return;
    }

    setLoading(false);
    setResult(computed);
    setSubmitted({ name: values.name.trim(), sector: values.sector });
    const anchor = document.getElementById('calculator');
    if (anchor) {
      const top = anchor.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  function recalculate() {
    setResult(null);
    setSubmitted(null);
    setErrors({});
  }

  const geometry = result ? chartGeometry(result.cumulative, result.breakevenYear, 460, 120) : null;
  const gaugeOffset = result
    ? (2 * Math.PI * 52 * (1 - Math.min(result.offset, 1))).toFixed(1)
    : undefined;

  const field = (key: keyof FormErrors) => `cf-field${errors[key] ? ' invalid' : ''}`;

  return (
    <div className="calc-shell" ref={sectionRef}>
      {!result ? (
        <div className="calc-card reveal dly1">
          <h3>Your details</h3>
          <p className="lead">
            Takes under a minute. Your report appears right here — no page reload, no waiting.
          </p>

          <form onSubmit={onSubmit} noValidate>
            <div className="cf-grid">
              <div className={field('name')} data-field="name">
                <label htmlFor="cfName">
                  {svg(
                    <>
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                    </>,
                  )}
                  Full Name
                </label>
                <div className="cf-wrap">
                  <input
                    className="cf-input"
                    id="cfName"
                    type="text"
                    placeholder="e.g. Ravinder Pabla"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => set('name')(event.target.value)}
                  />
                </div>
                <div className="cf-msg">
                  <Icon name="clock" />
                  <span>{errors.name ?? 'Please enter your name'}</span>
                </div>
              </div>

              <div className={field('phone')} data-field="phone">
                <label htmlFor="cfPhone">
                  <Icon name="phone" />
                  Mobile Number
                </label>
                <div className="cf-wrap">
                  <span className="cf-prefix">+91</span>
                  <input
                    className="cf-input has-prefix"
                    id="cfPhone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(event) => set('phone')(digitsOf(event.target.value))}
                  />
                </div>
                <div className="cf-msg">
                  <Icon name="clock" />
                  <span>{errors.phone ?? 'Enter a valid 10-digit number'}</span>
                </div>
              </div>

              <div className={field('email')} data-field="email">
                <label htmlFor="cfEmail">
                  <Icon name="mail" />
                  Email Address
                </label>
                <div className="cf-wrap">
                  <input
                    className="cf-input"
                    id="cfEmail"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => set('email')(event.target.value)}
                  />
                </div>
                <div className="cf-msg">
                  <Icon name="clock" />
                  <span>{errors.email ?? 'Enter a valid email address'}</span>
                </div>
              </div>

              <div className={field('bill')} data-field="bill">
                <label htmlFor="cfBill">
                  {svg(
                    <>
                      <path d="M6 3h12l-1 4H7zM6 3v18l3-2 3 2 3-2 3 2V3" />
                      <path d="M9 11h6M9 15h4" />
                    </>,
                  )}
                  Avg. Monthly Electricity Bill
                </label>
                <div className="cf-wrap">
                  <span className="cf-prefix">₹</span>
                  <input
                    className="cf-input has-prefix"
                    id="cfBill"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 25,000"
                    value={values.bill}
                    onChange={(event) => set('bill')(event.target.value)}
                  />
                </div>
                <div className="cf-msg">
                  <Icon name="clock" />
                  <span>{errors.bill ?? 'Enter your average monthly bill'}</span>
                </div>
              </div>

              <div className="cf-field full" data-field="sector">
                <label htmlFor="cfSector">
                  {svg(
                    <>
                      <path d="M3 21h18M5 21V8l7-5 7 5v13" />
                      <path d="M9 21v-6h6v6" />
                    </>,
                  )}
                  Sector
                </label>
                <div className="cf-wrap">
                  <select
                    className="cf-input"
                    id="cfSector"
                    value={values.sector}
                    onChange={(event) => set('sector')(event.target.value)}
                  >
                    {SECTORS.map((sector) => (
                      <option value={sector} key={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="cf-submit">
              <button
                type="submit"
                className={`cta cf-btn${loading ? ' loading' : ''}`}
                disabled={loading}
              >
                <span className="circ">
                  <Icon name="arrowRight" />
                </span>
                <span className="spin" />
                <span className="lbl">Calculate My Savings</span>
              </button>
            </div>

            {submitError ? (
              <p
                role="alert"
                style={{
                  margin: '12px 0 0',
                  color: '#ff9a9a',
                  fontSize: '.82rem',
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}
              >
                {submitError}{' '}
                <a href={telHref} style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {siteSettings.phoneDisplay}
                </a>
              </p>
            ) : null}

            <div className="cf-secure">
              <Icon name="shield" />
              <span>
                <b>Your information is completely secure</b> and will only be used to prepare your
                personalized solar report.
              </span>
            </div>
          </form>
        </div>
      ) : (
        <div className="calc-report show">
          <div className="rep-head">
            <div className="rep-check">
              <Icon name="check" />
            </div>
            <h3>
              Congratulations<span className="hl">,</span>{' '}
              <span>{submitted?.name.split(' ')[0] || 'friend'}</span>!
            </h3>
            <p>
              Based on your electricity usage, here&apos;s what going solar with SKP could look
              like for your <b>{SECTOR_WORD[submitted?.sector ?? ''] ?? 'property'}</b>.
            </p>
          </div>

          <div className="rep-hero">
            <div className="rep-hero-card">
              <div className="rep-gauge-wrap">
                <svg className="rep-gauge" viewBox="0 0 128 128" aria-hidden="true">
                  <circle className="track" cx="64" cy="64" r="52" />
                  <circle
                    className="arc"
                    cx="64"
                    cy="64"
                    r="52"
                    style={{ strokeDashoffset: gaugeOffset }}
                  />
                </svg>
                <div className="rep-gauge-c">
                  <span className="sz">{size.toFixed(1)}</span>
                  <span className="u">kW SYSTEM</span>
                </div>
              </div>
              <div className="rep-hero-lead">
                <div className="k">Recommended system</div>
                <div className="big">
                  <span>{size.toFixed(1)}</span> kW
                </div>
                <div className="off">covers {Math.round(result.offset * 100)}% of your usage</div>
              </div>
            </div>

            <div className="rep-hero-card save">
              <div className="k">Estimated monthly savings</div>
              <div className="big">{formatInr(monthly)}</div>
              <div className="off">
                {Math.round(generation).toLocaleString('en-IN')} units generated / month
              </div>
            </div>
          </div>

          <div className="rep-grid">
            <div className="rep-kpi green">
              <div className="kico">{KPI_GLYPHS.rupee}</div>
              <div className="v">{formatInr(annual)}</div>
              <div className="k">Estimated annual savings</div>
            </div>
            <div className="rep-kpi green">
              <div className="kico">{KPI_GLYPHS.chart}</div>
              <div className="v">{formatInr(total25)}</div>
              <div className="k">25-year estimated savings</div>
            </div>
            <div className="rep-kpi">
              <div className="kico">{KPI_GLYPHS.calendar}</div>
              <div className="v">{formatInr(cost)}</div>
              <div className="k">Estimated project cost</div>
            </div>
            <div className="rep-kpi">
              <div className="kico">{KPI_GLYPHS.clock}</div>
              <div className="v">{payback.toFixed(1)} yrs</div>
              <div className="k">Estimated payback period</div>
            </div>
            <div className="rep-kpi green">
              <div className="kico">{KPI_GLYPHS.leaf}</div>
              <div className="v">{co2.toFixed(0)} t</div>
              <div className="k">CO₂ emissions reduced (25 yrs)</div>
            </div>
            <div className="rep-kpi green">
              <div className="kico">{KPI_GLYPHS.tree}</div>
              <div className="v">{Math.round(trees).toLocaleString('en-IN')}</div>
              <div className="k">Trees planted equivalent</div>
            </div>
          </div>

          {geometry ? (
            <div className="rep-chart-box">
              <div className="rep-chart-head">
                <b>Cumulative net savings over 25 years</b>
                <span>Breakeven — yr {result.breakevenYear.toFixed(1)}</span>
              </div>
              <svg
                className="rep-chart"
                viewBox="0 0 460 120"
                preserveAspectRatio="none"
                role="img"
                aria-label={`Cumulative net savings, breaking even in year ${result.breakevenYear.toFixed(
                  1,
                )}`}
              >
                <line className="zero" x1="8" y1={geometry.zeroY} x2="452" y2={geometry.zeroY} />
                <path className="ar" d={geometry.area} />
                <line className="pb" x1={geometry.paybackX} y1="6" x2={geometry.paybackX} y2="114" />
                <path className="ln" d={geometry.line} />
                <circle className="pbdot" cx={geometry.paybackX} cy={geometry.zeroY} r="3.4" />
              </svg>
              <div className="rep-xlabels">
                <span>Today</span>
                <span>Year 12</span>
                <span>Year 25</span>
              </div>
            </div>
          ) : null}

          <p className="rep-note">
            Indicative estimate using SKP&apos;s engineering formula: 4 units per kW per day,
            ₹31,500 project cost per kW, with conservative 3%/yr tariff escalation and ~0.6%/yr
            panel degradation modelled over 25 years. Your SKP engineer confirms exact figures
            after a free site survey.
          </p>

          <div className="rep-cta">
            <h4>Ready to Start Saving?</h4>
            <p>Lock in these savings — book a free site visit or talk to a solar expert today.</p>
            <div className="rep-cta-row">
              <a href={ANCHORS.enquiry} className="rbtn rbtn-gold">
                <span className="circ">
                  <Icon name="arrowRight" />
                </span>
                Book Free Site Visit
              </a>
              <a href={telHref} className="rbtn rbtn-ghost">
                <Icon name="phone" />
                Call Solar Expert
              </a>
              <a href={waHref} className="rbtn rbtn-wa" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                WhatsApp Us
              </a>
            </div>
            <div className="rep-again-wrap">
              <button type="button" className="rep-again" onClick={recalculate}>
                <Icon name="refresh" />
                Recalculate with different details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
