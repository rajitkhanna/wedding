interface InfoCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

export function InfoCard({ icon, title, children }: InfoCardProps) {
  return (
    <div
      className="flex flex-1 flex-col rounded-lg p-5"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none" role="img" aria-hidden="true">
          {icon}
        </span>
        <h3
          className="text-lg"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
            fontWeight: 400,
          }}
        >
          {title}
        </h3>
      </div>
      <div
        className="mt-3 text-sm font-light leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {children}
      </div>
    </div>
  );
}
