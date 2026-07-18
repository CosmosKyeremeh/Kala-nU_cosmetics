export function StatsCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
      <p className="text-sm text-slate">{label}</p>
      <p className={`font-display mt-1 text-3xl font-semibold ${accent ? "text-rose-primary" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}
