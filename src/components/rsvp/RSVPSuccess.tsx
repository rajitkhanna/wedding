'use client';

interface RSVPSuccessProps {
  name: string;
  attending: boolean;
}

export function RSVPSuccess({ name, attending }: RSVPSuccessProps) {
  return (
    <div
      className="flex flex-col items-center gap-6 py-12 text-center"
      style={{ animation: 'fadeIn 0.6s ease-out' }}
    >
      {/* Rose SVG */}
      <div style={{ animation: 'roseBloom 0.8s ease-out forwards' }}>
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Stem */}
          <path
            d="M40 72 C40 72 38 58 40 50"
            stroke="var(--color-text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Leaf */}
          <path
            d="M40 60 C35 55 28 56 30 62 C32 66 38 64 40 60Z"
            fill="var(--color-text-muted)"
            opacity="0.6"
          />
          {/* Outer petals */}
          <path
            d="M40 44 C34 36 26 36 28 44 C30 50 38 50 40 44Z"
            fill="var(--color-red)"
            opacity="0.7"
          />
          <path
            d="M40 44 C46 36 54 36 52 44 C50 50 42 50 40 44Z"
            fill="var(--color-red)"
            opacity="0.7"
          />
          <path
            d="M40 44 C32 40 28 32 36 30 C42 28 44 38 40 44Z"
            fill="var(--color-red)"
            opacity="0.8"
          />
          <path
            d="M40 44 C48 40 52 32 44 30 C38 28 36 38 40 44Z"
            fill="var(--color-red)"
            opacity="0.8"
          />
          {/* Inner petals */}
          <path
            d="M40 42 C36 36 34 30 38 28 C42 26 44 34 40 42Z"
            fill="var(--color-gold-dim)"
            opacity="0.9"
          />
          <path
            d="M40 42 C44 36 46 30 42 28 C38 26 36 34 40 42Z"
            fill="var(--color-gold-dim)"
            opacity="0.9"
          />
          {/* Center */}
          <circle cx="40" cy="38" r="5" fill="var(--color-gold)" opacity="0.9" />
          <circle cx="40" cy="38" r="3" fill="var(--color-gold-light)" />
        </svg>
      </div>

      {/* Check mark circle */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: '3rem',
          height: '3rem',
          background: 'var(--color-surface-alt)',
          border: '2px solid var(--color-gold)',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 10 L8 14 L16 6"
            stroke="var(--color-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-gold)',
            fontSize: '1.75rem',
            fontWeight: 400,
            marginBottom: '0.5rem',
          }}
        >
          Thank you, {name}!
        </h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '24rem' }}>
          {attending
            ? "We can't wait to celebrate with you."
            : 'We\'ll miss you, but we appreciate you letting us know.'}
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes roseBloom {
          from { opacity: 0; transform: scale(0.6) rotate(-10deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
