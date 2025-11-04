import { useState } from "react";

export default function Tabs({ children, initial = "KPIs" }) {
  const [tab, setTab] = useState(initial);
  const items = ["KPIs", "Ads", "Inventory", "Finance"];
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        {items.map((it) => (
          <button
            key={it}
            onClick={() => setTab(it)}
            className={
              "px-3 py-1 rounded-lg text-sm font-medium " +
              (tab === it
                ? "bg-amber-200 dark:bg-amber-600 text-amber-900 dark:text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300")
            }
          >
            {it}
          </button>
        ))}
      </div>
      <div>{children({ tab })}</div>
    </div>
  );
}
// End of Tabs component (harmless comment to trigger file watch)
