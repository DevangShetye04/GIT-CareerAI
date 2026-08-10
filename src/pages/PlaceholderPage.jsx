export default function PlaceholderPage({ title, description }) {
  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">{title}</h1>
        <p className="font-body text-sm mt-1 text-ink-soft">{description}</p>
      </div>
      <div className="rounded-2xl bg-card border border-line p-8 text-center">
        <p className="font-body text-sm text-ink-faint">This section is coming soon.</p>
      </div>
    </>
  );
}
