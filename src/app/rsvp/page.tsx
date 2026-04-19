'use client';

import { RSVPForm } from '@/components/rsvp/RSVPForm';

export default function RSVPPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center px-6 py-24"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Page header */}
      <div className="mb-12 text-center">
        <p className="t-label mb-5" style={{ letterSpacing: 'var(--ls-caps)' }}>
          November 28–30, 2026 · Boston
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-gold)',
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            lineHeight: 1.05,
            marginBottom: '1rem',
          }}
        >
          RSVP
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-xl)',
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}
        >
          We hope to celebrate with you.
        </p>
      </div>

      {/* Gold rule */}
      <div
        className="mb-12 flex items-center gap-4"
        style={{ width: '100%', maxWidth: '36rem' }}
      >
        <div className="gold-rule flex-1" />
        <span style={{ color: 'var(--color-gold-dim)', fontSize: '0.7rem' }}>✦</span>
        <div className="gold-rule flex-1" />
      </div>

      {/* Form card */}
      <div
        className="w-full rsvp-card"
        style={{ maxWidth: '36rem' }}
      >
        <RSVPForm />
      </div>

      {/* Footer note */}
      <p
        className="mt-10 text-center"
        style={{
          color: 'var(--color-text-dim)',
          fontSize: 'var(--text-xs)',
          maxWidth: '28rem',
          lineHeight: 'var(--lh-relaxed)',
        }}
      >
        Questions? Reach us at{' '}
        <a
          href="mailto:meghanarajit2026@gmail.com"
          style={{ color: 'var(--color-text-muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
        >
          meghanarajit2026@gmail.com
        </a>
      </p>
    </div>
  );
}
