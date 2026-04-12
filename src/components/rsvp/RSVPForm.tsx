'use client';

import { useState } from 'react';
import { lookup } from '@instantdb/react';
import { db } from '@/lib/instant/db';
import { RSVPSuccess } from './RSVPSuccess';

type RSVPStatus = 'attending' | 'not-attending' | '';
type MealPref = 'veg' | 'non-veg' | 'vegan' | 'pescatarian';

interface FormState {
  name: string;
  email: string;
  rsvpStatus: RSVPStatus;
  mealPreference: MealPref | '';
  dietaryRestrictions: string;
  plusOne: boolean;
  plusOneName: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  rsvpStatus: '',
  mealPreference: '',
  dietaryRestrictions: '',
  plusOne: false,
  plusOneName: '',
};

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function RSVPForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const attending = form.rsvpStatus === 'attending';

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.rsvpStatus) return;

    setSubmitState('submitting');
    setErrorMessage('');

    try {
      await db.transact(
        db.tx.guests[lookup('email', form.email)].merge({
          name: form.name,
          email: form.email,
          rsvpStatus: form.rsvpStatus,
          mealPreference: attending ? form.mealPreference || undefined : undefined,
          dietaryRestrictions: attending ? form.dietaryRestrictions || undefined : undefined,
          plusOneName: attending && form.plusOne ? form.plusOneName || undefined : undefined,
          rsvpSubmittedAt: Date.now(),
        })
      );
      setSubmitState('success');
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Please try again.');
      setSubmitState('error');
    }
  }

  if (submitState === 'success') {
    return <RSVPSuccess name={form.name} attending={attending} />;
  }

  const isSubmitting = submitState === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Name ─────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <label className="rsvp-label" htmlFor="rsvp-name">
          Your Name
        </label>
        <input
          id="rsvp-name"
          type="text"
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="rsvp-input"
          disabled={isSubmitting}
        />
      </div>

      {/* ── Email ────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <label className="rsvp-label" htmlFor="rsvp-email">
          Email Address
        </label>
        <input
          id="rsvp-email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          className="rsvp-input"
          disabled={isSubmitting}
        />
      </div>

      {/* ── Attendance ───────────────────────────────────────────────── */}
      <div className="mb-5">
        <fieldset>
          <legend className="rsvp-label">Will you be attending?</legend>
          <div className="mt-2 flex flex-col gap-3">
            {(
              [
                { value: 'attending', label: 'Joyfully accept' },
                { value: 'not-attending', label: 'Regretfully decline' },
              ] as const
            ).map(({ value, label }) => (
              <label key={value} className="rsvp-radio-label">
                <input
                  type="radio"
                  name="rsvpStatus"
                  value={value}
                  checked={form.rsvpStatus === value}
                  onChange={() => set('rsvpStatus', value)}
                  className="rsvp-radio"
                  disabled={isSubmitting}
                />
                <span className="rsvp-radio-custom" aria-hidden="true" />
                <span style={{ color: 'var(--color-text)' }}>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* ── Attending-only fields ─────────────────────────────────────── */}
      {attending && (
        <>
          {/* Divider */}
          <hr className="gold-rule my-6" />

          {/* Meal Preference */}
          <div className="mb-5">
            <label className="rsvp-label" htmlFor="rsvp-meal">
              Meal Preference
            </label>
            <div className="rsvp-select-wrapper">
              <select
                id="rsvp-meal"
                value={form.mealPreference}
                onChange={(e) => set('mealPreference', e.target.value as MealPref)}
                className="rsvp-select"
                disabled={isSubmitting}
              >
                <option value="">Select a preference</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescatarian">Pescatarian</option>
              </select>
              <span className="rsvp-select-arrow" aria-hidden="true">▾</span>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="mb-5">
            <label className="rsvp-label" htmlFor="rsvp-diet">
              Dietary Restrictions{' '}
              <span style={{ color: 'var(--color-text-dim)', fontWeight: 300 }}>
                (optional)
              </span>
            </label>
            <textarea
              id="rsvp-diet"
              rows={3}
              placeholder="Allergies, intolerances, or other notes…"
              value={form.dietaryRestrictions}
              onChange={(e) => set('dietaryRestrictions', e.target.value)}
              className="rsvp-input rsvp-textarea"
              disabled={isSubmitting}
            />
          </div>

          {/* Plus One */}
          <div className="mb-5">
            <label className="rsvp-checkbox-label">
              <input
                type="checkbox"
                checked={form.plusOne}
                onChange={(e) => {
                  set('plusOne', e.target.checked);
                  if (!e.target.checked) set('plusOneName', '');
                }}
                className="rsvp-checkbox"
                disabled={isSubmitting}
              />
              <span className="rsvp-checkbox-custom" aria-hidden="true" />
              <span style={{ color: 'var(--color-text)' }}>
                Yes, I&rsquo;m bringing a plus one
              </span>
            </label>
          </div>

          {/* Plus One Name */}
          {form.plusOne && (
            <div className="mb-5">
              <label className="rsvp-label" htmlFor="rsvp-plus-one">
                Plus One Name
              </label>
              <input
                id="rsvp-plus-one"
                type="text"
                placeholder="Guest's full name"
                value={form.plusOneName}
                onChange={(e) => set('plusOneName', e.target.value)}
                className="rsvp-input"
                disabled={isSubmitting}
              />
            </div>
          )}
        </>
      )}

      {/* ── Error ────────────────────────────────────────────────────── */}
      {submitState === 'error' && errorMessage && (
        <p
          className="mb-5 rounded px-4 py-3 text-sm"
          style={{
            background: 'rgba(139, 26, 26, 0.18)',
            border: '1px solid var(--color-red)',
            color: 'var(--color-text)',
          }}
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      {/* ── Submit ───────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting || !form.name || !form.email || !form.rsvpStatus}
        className="rsvp-submit-btn"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="rsvp-spinner" aria-hidden="true" />
            Sending…
          </span>
        ) : (
          'Send RSVP'
        )}
      </button>
    </form>
  );
}
