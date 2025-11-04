import { useEffect, useMemo, useState } from "react";
import { channels, sampleKpis } from "../channels";
import AgentDock from "../components/AgentDock";
import BestPractices from "../components/BestPractices";
import DateRange from "../components/DateRange";
import Header from "../components/Header";
import KpiCard from "../components/KpiCard";
import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";

export default function Dashboard() {
  const [chan, setChan] = useState("All");
  const [sku, setSku] = useState("SKU-123");
  const [qty, setQty] = useState(10);
  const [cost, setCost] = useState(25);
  const [type, setType] = useState("inventory");
  const [unit, setUnit] = useState(null);
  const [acct, setAcct] = useState(null);

  const chartData = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        d: `D${i + 1}`,
        y: Math.round(2000 + Math.sin(i / 2) * 300 + i * 50),
      })),
    [],
  );
  const kpis = useMemo(() => sampleKpis, []);

  async function refreshSummary() {
    const r = await fetch("/api/accounting-summary");
    const j = await r.json();
    setAcct(j.data);
  }
  async function submitBatch(e) {
    e.preventDefault();
    const r = await fetch("/api/cost-intake", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sku, qty: Number(qty), cost: Number(cost), type }),
    });
    const j = await r.json();
    setUnit(j.summary);
    refreshSummary();
  }
  useEffect(() => {
    refreshSummary();
  }, []);

  // Ads state
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [adsError, setAdsError] = useState(null);
  const [adsSort, setAdsSort] = useState({ key: "spend", dir: "desc" });

  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [invLoading, setInvLoading] = useState(false);
  const [invError, setInvError] = useState(null);

  async function fetchAds() {
    setAdsLoading(true);
    setAdsError(null);
    try {
      const q = new URLSearchParams({ channel: chan || "All" });
      const r = await fetch(`/api/ads?${q.toString()}`);
      if (!r.ok) throw new Error(`Status ${r.status}`);
      const j = await r.json();
      setAds(j.items || []);
    } catch (err) {
      console.error("fetchAds", err);
      setAdsError(String(err.message || err));
    } finally {
      setAdsLoading(false);
    }
  }

  async function fetchInventory() {
    setInvLoading(true);
    setInvError(null);
    try {
      const q = new URLSearchParams({ channel: chan || "All" });
      const r = await fetch(`/api/inventory?${q.toString()}`);
      if (!r.ok) throw new Error(`Status ${r.status}`);
      const j = await r.json();
      setInventory(j.items || []);
    } catch (err) {
      console.error("fetchInventory", err);
      setInvError(String(err.message || err));
    } finally {
      setInvLoading(false);
    }
  }

  useEffect(() => {
    // refresh ads & inventory whenever channel changes
    fetchAds();
    fetchInventory();
  }, [chan]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr_320px]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="p-4 grid gap-4">
          {/* Top controls: channel + daterange */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="font-medium">Channel</div>
              <select
                className="input"
                value={chan}
                onChange={(e) => setChan(e.target.value)}
              >
                {channels.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <DateRange value="30d" onChange={() => {}} />
            </div>
          </div>

          <Tabs>
            {({ tab }) => (
              <div>
                {tab === "KPIs" && (
                  <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <KpiCard
                      label="Revenue"
                      value={`$${kpis.revenue.toLocaleString()}`}
                    />
                    <KpiCard label="Orders" value={kpis.orders} />
                    <KpiCard label="AOV" value={`$${kpis.aov}`} />
                    <KpiCard
                      label="Margin"
                      value={`${(kpis.marginPct * 100).toFixed(1)}%`}
                    />
                  </section>
                )}

                {tab === "Ads" && (
                  <section className="grid gap-4">
                    <div className="card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">Ad Campaigns</div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <div>Sort:</div>
                          <button
                            className={`px-2 py-1 rounded ${adsSort.key === "spend" ? "bg-neutral-200 dark:bg-neutral-700" : ""}`}
                            onClick={() =>
                              setAdsSort((s) => ({
                                key: "spend",
                                dir:
                                  s.key === "spend" && s.dir === "desc"
                                    ? "asc"
                                    : "desc",
                              }))
                            }
                          >
                            Spend
                          </button>
                          <button
                            className={`px-2 py-1 rounded ${adsSort.key === "roas" ? "bg-neutral-200 dark:bg-neutral-700" : ""}`}
                            onClick={() =>
                              setAdsSort((s) => ({
                                key: "roas",
                                dir:
                                  s.key === "roas" && s.dir === "desc"
                                    ? "asc"
                                    : "desc",
                              }))
                            }
                          >
                            ROAS
                          </button>
                        </div>
                      </div>

                      {adsLoading && (
                        <div className="text-sm text-neutral-500">
                          Loading campaigns...
                        </div>
                      )}
                      {adsError && (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          Error: {adsError}
                        </div>
                      )}

                      {!adsLoading && !adsError && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-neutral-200 dark:border-neutral-800">
                                <th className="py-2 pr-3">Campaign</th>
                                <th className="py-2 pr-3">Status</th>
                                <th className="py-2 pr-3">Spend</th>
                                <th className="py-2 pr-3">Sales</th>
                                <th className="py-2 pr-3">ROAS</th>
                                <th className="py-2 pr-3">TACOS</th>
                                <th className="py-2 pr-3">Bid Strategy</th>
                                <th className="py-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* summary row */}
                              {(() => {
                                const totalSpend = ads.reduce(
                                  (s, a) => s + (Number(a.spend) || 0),
                                  0,
                                );
                                const totalSales = ads.reduce(
                                  (s, a) => s + (Number(a.sales) || 0),
                                  0,
                                );
                                const avgRoas = totalSpend
                                  ? Math.round(
                                      (totalSales / totalSpend) * 100,
                                    ) / 100
                                  : 0;
                                const tacos = totalSales
                                  ? Math.round(
                                      (totalSpend / totalSales) * 10000,
                                    ) / 100
                                  : 0;
                                return (
                                  <tr className="bg-neutral-50 dark:bg-neutral-900 font-medium border-b border-neutral-200 dark:border-neutral-800">
                                    <td className="py-2 pr-3">Totals</td>
                                    <td className="py-2 pr-3">—</td>
                                    <td className="py-2 pr-3">
                                      ${totalSpend.toFixed(2)}
                                    </td>
                                    <td className="py-2 pr-3">
                                      ${totalSales.toFixed(2)}
                                    </td>
                                    <td className="py-2 pr-3">{avgRoas}</td>
                                    <td className="py-2 pr-3">{tacos}%</td>
                                    <td className="py-2 pr-3">—</td>
                                    <td className="py-2">—</td>
                                  </tr>
                                );
                              })()}

                              {(() => {
                                const rows = [...ads];
                                rows.sort((a, b) => {
                                  const k = adsSort.key;
                                  const av = Number(a[k] || 0);
                                  const bv = Number(b[k] || 0);
                                  if (av === bv) return 0;
                                  return adsSort.dir === "asc"
                                    ? av - bv
                                    : bv - av;
                                });
                                return rows.map((r) => (
                                  <tr
                                    key={r.campaign}
                                    className="border-b border-neutral-100 dark:border-neutral-800"
                                  >
                                    <td className="py-2 pr-3">{r.campaign}</td>
                                    <td className="py-2 pr-3">{r.status}</td>
                                    <td className="py-2 pr-3">
                                      ${r.spend.toFixed(2)}
                                    </td>
                                    <td className="py-2 pr-3">
                                      ${r.sales.toFixed(2)}
                                    </td>
                                    <td className="py-2 pr-3">{r.roas}</td>
                                    <td className="py-2 pr-3">{r.tacos}%</td>
                                    <td className="py-2 pr-3">
                                      {r.bidStrategy}
                                    </td>
                                    <td className="py-2">
                                      <div className="flex gap-2">
                                        <button className="btn-ghost">
                                          Pause
                                        </button>
                                        <button className="btn-ghost">
                                          Cap Bid
                                        </button>
                                        <button className="btn-ghost">
                                          Notes
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {tab === "Inventory" && (
                  <section className="grid gap-4">
                    <div className="card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">Inventory</div>
                        <div className="text-sm text-neutral-500">
                          Reorder safety: 5 days
                        </div>
                      </div>

                      {invLoading && (
                        <div className="text-sm text-neutral-500">
                          Loading inventory...
                        </div>
                      )}
                      {invError && (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          Error: {invError}
                        </div>
                      )}

                      {!invLoading && !invError && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-neutral-200 dark:border-neutral-800">
                                <th className="py-2 pr-3">SKU</th>
                                <th className="py-2 pr-3">On-hand</th>
                                <th className="py-2 pr-3">30d Sales</th>
                                <th className="py-2 pr-3">Daily Sales</th>
                                <th className="py-2 pr-3">Lead Time (days)</th>
                                <th className="py-2 pr-3">Reorder Point</th>
                                <th className="py-2 pr-3">Suggested Order</th>
                                <th className="py-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inventory.map((it) => (
                                <tr
                                  key={it.sku}
                                  className="border-b border-neutral-100 dark:border-neutral-800"
                                >
                                  <td className="py-2 pr-3">{it.sku}</td>
                                  <td className="py-2 pr-3">{it.on_hand}</td>
                                  <td className="py-2 pr-3">{it.sales_30d}</td>
                                  <td className="py-2 pr-3">
                                    {it.daily_sales}
                                  </td>
                                  <td className="py-2 pr-3">{it.lead_time}</td>
                                  <td className="py-2 pr-3">
                                    {it.reorder_point}
                                  </td>
                                  <td className="py-2 pr-3">
                                    {it.suggested_order}
                                  </td>
                                  <td className="py-2">
                                    <button
                                      className="btn-ghost"
                                      onClick={() =>
                                        console.log("Create PO for", it.sku)
                                      }
                                    >
                                      Create PO
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {tab === "Finance" && (
                  <section className="grid gap-4">
                    <div className="card p-4">
                      Finance KPIs and P&L snapshots.
                    </div>
                  </section>
                )}
              </div>
            )}
          </Tabs>
        </main>
      </div>

      {/* Right rail */}
      <aside className="hidden md:flex flex-col gap-4 p-4">
        <AgentDock channel={chan} />
        <BestPractices channel={chan} />
      </aside>
    </div>
  );
}
