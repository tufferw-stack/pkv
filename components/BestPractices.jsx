import { useEffect, useState } from "react";

export default function BestPractices({ channel = "All" }) {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const q = new URLSearchParams({ channel: channel || "All" });
        const r = await fetch(`/api/best-practices?${q.toString()}`);
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body?.error || `Status ${r.status}`);
        }
        const j = await r.json();
        if (!cancelled) setItems(j.items || []);
      } catch (err) {
        console.error("best-practices fetch error", err);
        if (!cancelled) setError(String(err.message || err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [channel]);

  return (
    <div className="space-y-2">
      <div className="font-semibold">Best Practices</div>
      <div className="card p-3">
        {loading && <div className="text-sm text-neutral-500">Loading...</div>}
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        )}
        {!loading && !error && (
          <ul className="text-sm space-y-2">
            {(items || []).map((it) => (
              <li
                key={it.title}
                className="text-neutral-700 dark:text-neutral-300"
              >
                <a
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline"
                >
                  {it.title}
                </a>
                <div className="text-xs text-neutral-500">{it.summary}</div>
              </li>
            ))}
            {(!items || items.length === 0) && (
              <li className="text-sm text-neutral-500">
                No suggestions for this channel.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
