export function PlaceholderSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </section>
  );
}
