import { runAssistant } from "@/lib/ai";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AssistantPage({ searchParams }: Props) {
  const prompt = (await searchParams).q ?? "Which laptop should I buy under ₹70000 for coding?";
  const result = runAssistant(prompt);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">AI shopping assistant</h1>
      <form className="rounded-xl border border-slate-200 bg-white p-4" action="/assistant">
        <input name="q" defaultValue={prompt} className="w-full rounded-lg border border-slate-300 px-4 py-3" />
      </form>
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Grounded answer</h2>
        <p className="mt-2 text-sm text-slate-700">{result.response}</p>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">Verified data sources</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
          {result.verifiedDataPoints.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">AI inference is labeled and never overrides structured catalog fields.</p>
      </section>
    </div>
  );
}
