import { Play, Settings } from "lucide-react";
import { useState } from "react";

export default function AgentDock({ channel = "All" }) {
  const [autoApprove, setAutoApprove] = useState(false);
  const [running, setRunning] = useState({}); // id => boolean
  const [outputs, setOutputs] = useState({}); // id => output string
  const [errors, setErrors] = useState({});

  const agents = [
    { id: "margin", name: "MarginTuff", desc: "Streamlit margin agent" },
    { id: "grok", name: "Grok-Agent", desc: "Automation rules" },
    { id: "approver", name: "Auto Approver", desc: "Auto-approve suggestions" },
  ];

  async function runAgent(a) {
    setErrors((prev) => ({ ...prev, [a.id]: null }));
    setRunning((prev) => ({ ...prev, [a.id]: true }));
    try {
      const prompt = `Run agent ${a.id} (${a.name}) for channel ${channel}`;
      const r = await fetch("/api/agent-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, channel }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body?.error || `Status ${r.status}`);
      }
      const j = await r.json();
      setOutputs((prev) => ({ ...prev, [a.id]: j.output }));
    } catch (err) {
      console.error("runAgent error", err);
      setErrors((prev) => ({ ...prev, [a.id]: String(err.message || err) }));
    } finally {
      setRunning((prev) => ({ ...prev, [a.id]: false }));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Agent Dock</div>
        <div className="text-sm text-neutral-500">v0.1</div>
      </div>

      <div className="card p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">AUTO-APPROVE ALL</div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="w-4 h-4"
            />
          </label>
        </div>
        <div className="text-xs text-neutral-500 mt-2">
          When enabled, agent suggestions will be applied automatically. Use
          with caution in production.
        </div>
      </div>

      <div className="space-y-2">
        {agents.map((a) => (
          <div key={a.id} className="card p-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-neutral-500">{a.desc}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="btn"
                  disabled={!!running[a.id]}
                  onClick={() => runAgent(a)}
                >
                  {running[a.id] ? "Running..." : "Run"}{" "}
                  <Play size={14} className="inline-block ml-1" />
                </button>
                <button className="btn-ghost">
                  Config <Settings size={14} className="inline-block ml-1" />
                </button>
              </div>
            </div>

            {/* output / error */}
            {outputs[a.id] && (
              <pre className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-md text-sm overflow-auto">
                {outputs[a.id]}
              </pre>
            )}
            {errors[a.id] && (
              <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                Error: {errors[a.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
