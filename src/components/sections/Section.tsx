interface SectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function Section({ title, description, children }: SectionProps) {
  return (
    <div className="min-h-screen w-full bg-zinc-50 py-16 dark:bg-black">
      <div className="mx-auto max-w-4xl px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
