'use client';

import { useRef, useState } from 'react';
import { Cta, CtaGhost } from '@/components/ui/Button';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';
import { FieldRow, SelectField, TextAreaField, TextField } from './Field';
import {
  hasErrors,
  SECTORS,
  validateLead,
  type LeadErrors,
  type LeadPayload,
  type LeadSource,
} from '@/lib/leads';
import { waHref } from '@/lib/site';

const EMPTY = {
  name: '',
  company: '',
  mobile: '',
  email: '',
  city: '',
  sector: '',
  message: '',
};

interface EnquiryFormProps {
  source: LeadSource;
  /** Calculator context attached to the lead, when submitted from that page. */
  estimate?: LeadPayload['estimate'];
  heading?: string;
}

/**
 * `.gform` — the enquiry form and its success state.
 *
 * Markup, field order, error copy and the success panel are all the approved
 * design's. Two things changed from the handoff:
 *  · the localStorage stub is replaced by `POST /api/leads`
 *  · errors clear as the user edits the field, which the original also did
 *    (`initFieldClears()`)
 */
export function EnquiryForm({
  source,
  estimate,
  heading = 'Send us an enquiry',
}: EnquiryFormProps) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof typeof EMPTY) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    /* Clear the field's error as soon as the user edits it. */
    setErrors((current) => {
      if (!current[key as keyof LeadErrors]) return current;
      const next = { ...current };
      delete next[key as keyof LeadErrors];
      return next;
    });
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateLead(values);
    if (hasErrors(found)) {
      setErrors(found);
      /* Focus the first invalid control, as the approved form did. */
      const firstBad = cardRef.current?.querySelector<HTMLElement>(
        '.fld.invalid input, .fld.invalid select',
      );
      firstBad?.focus();
      return;
    }

    setStatus('sending');
    setServerMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, source, estimate }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        errors?: LeadErrors;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setServerMessage(data.message ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('sent');
      /* Keep the success panel in view, matching the approved scroll nudge. */
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect && rect.top < 0) {
        window.scrollTo({ top: window.scrollY + rect.top - 90, behavior: 'smooth' });
      }
    } catch {
      setServerMessage('We could not send your enquiry. Please call or WhatsApp us.');
      setStatus('error');
    }
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setStatus('idle');
    setServerMessage('');
  }

  return (
    <div className="gform reveal dly1" ref={cardRef}>
      {status !== 'sent' ? (
        <form onSubmit={onSubmit} noValidate>
          <h3>
            <Icon name="mail" />
            {heading}
          </h3>

          <FieldRow>
            <TextField
              id="fName"
              label="Full Name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              value={values.name}
              error={errors.name}
              onChange={(event) => set('name')(event.target.value)}
            />
            <TextField
              id="fCompany"
              label="Company Name"
              optional
              type="text"
              placeholder="Company or institution"
              autoComplete="organization"
              value={values.company}
              onChange={(event) => set('company')(event.target.value)}
            />
          </FieldRow>

          <FieldRow>
            <TextField
              id="fMobile"
              label="Mobile Number"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              autoComplete="tel"
              value={values.mobile}
              error={errors.mobile}
              onChange={(event) => set('mobile')(event.target.value)}
            />
            <TextField
              id="fEmail"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={values.email}
              error={errors.email}
              onChange={(event) => set('email')(event.target.value)}
            />
          </FieldRow>

          <FieldRow>
            <TextField
              id="fCity"
              label="City"
              type="text"
              placeholder="e.g. Jalandhar"
              autoComplete="address-level2"
              value={values.city}
              error={errors.city}
              onChange={(event) => set('city')(event.target.value)}
            />
            <SelectField
              id="fSector"
              label="Sector"
              value={values.sector}
              error={errors.sector}
              onChange={(event) => set('sector')(event.target.value)}
            >
              <option value="" disabled>
                Select your sector
              </option>
              {SECTORS.map((sector) => (
                <option value={sector} key={sector}>
                  {sector}
                </option>
              ))}
            </SelectField>
          </FieldRow>

          <TextAreaField
            id="fMsg"
            label="Message"
            optional
            placeholder="Tell us about your site, monthly bill, or anything else that helps us prepare."
            value={values.message}
            onChange={(event) => set('message')(event.target.value)}
          />

          <Cta type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
          </Cta>

          {serverMessage ? (
            <p className="gform-note" role="alert" style={{ color: '#c04545' }}>
              {serverMessage}
            </p>
          ) : null}

          <div className="gform-note">
            <Icon name="lock" />
            Your information is secure and will only be used to assist you with your solar
            requirements.
          </div>
        </form>
      ) : (
        <div className="gsuccess show">
          <div className="gs-ic">
            <Icon name="check" />
          </div>
          <h4>Enquiry received. Thank you!</h4>
          <p>
            Our team will contact you <b>within 24 hours</b> on working days. For anything
            urgent, call us or say hello on WhatsApp.
          </p>
          <div className="gs-actions">
            <a
              href={waHref}
              className="gwa"
              style={{ padding: '13px 20px' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              <span>
                <b>Chat on WhatsApp</b>
              </span>
            </a>
            <CtaGhost icon="refresh" onClick={reset}>
              Send another enquiry
            </CtaGhost>
          </div>
        </div>
      )}
    </div>
  );
}
