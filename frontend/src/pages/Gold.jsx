import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#3b82f6", "#14b8a6", "#f59e0b", "#8b5cf6", "#ec4899", "#10b981"];

function GoldLoader() {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Loading Silver layer transformations...", color: "text-blue-400" },
    { text: "Sending clean data to Claude...", color: "text-blue-400" },
    { text: "Claude is computing KPIs...", color: "text-teal-400" },
    { text: "Generating chart configurations...", color: "text-teal-400" },
    { text: "Identifying business insights...", color: "text-teal-400" },
    { text: "Writing Gold layer PySpark code...", color: "text-purple-400" },
    { text: "Aggregating analytics-ready output...", color: "text-purple-400" },
    { text: "Validating chart data structures...", color: "text-purple-400" },
    { text: "Finalizing business intelligence report...", color: "text-green-400" },
    { text: "Gold layer complete — rendering dashboard...", color: "text-green-400" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"/>
        <span className="text-teal-400 text-sm font-medium">Claude is building your Gold layer</span>
      </div>

      <div className="rounded-xl border border-teal-500/20 overflow-hidden"
        style={{ background: "rgba(0,20,20,0.6)", backdropFilter: "blur(10px)" }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-teal-500/10"
          style={{ background: "rgba(0,10,10,0.8)" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500/60 animate-pulse"/>
          <span className="text-teal-500/60 text-xs font-mono">gold_analytics.py</span>
        </div>
        <div className="p-5 font-mono text-sm space-y-2 min-h-64">
          {steps.slice(0, step + 1).map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gray-600 shrink-0">{i < step ? "✓" : "›"}</span>
              <span className={i < step ? "text-gray-600" : s.color}>{s.text}</span>
            </div>
          ))}
          {step < steps.length - 1 && (
            <span className="text-teal-400 animate-pulse ml-4">▊</span>
          )}
        </div>
      </div>

      <div className="mt-6 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-green-500 rounded-full transition-all duration-1000"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      <p className="text-gray-600 text-xs mt-2 text-right">
        {Math.round(((step + 1) / steps.length) * 100)}%
      </p>
    </div>
  );
}

export default function Gold({ bronzeData, silverData, onRestart }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    async function fetchGold() {
      try {
        const res = await axios.post("https://dataflow-studio-backend.onrender.com/gold/analyze", {
          preview: bronzeData.preview,
          schema: bronzeData.schema,
          summary: silverData.summary,
          transformations: silverData.transformations,
        });
        setData(res.data);
      } catch (err) {
        setError("Gold analysis failed.");
      } finally {
        setLoading(false);
      }
    }
    fetchGold();
  }, [bronzeData, silverData]);

  const handleDownload = async (type) => {
    const payload = {
      preview: bronzeData.preview,
      schema: bronzeData.schema,
      summary: silverData.summary,
      transformations: silverData.transformations,
      insights: data.business_insights,
      kpis: data.kpis,
      filename: bronzeData.filename,
    };

    const res = await fetch(`https://dataflow-studio-backend.onrender.com/gold/download/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = type === "csv"
      ? `cleaned_${bronzeData.filename}`
      : type === "code"
      ? `pipeline_${bronzeData.filename.replace(".csv", ".py")}`
      : `report_${bronzeData.filename.replace(".csv", ".txt")}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <GoldLoader />;

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400">{error}</p>
    </div>
  );

  const kpiColors = {
    green: "border-green-500 text-green-400",
    blue: "border-blue-500 text-blue-400",
    amber: "border-amber-500 text-amber-400",
    red: "border-red-500 text-red-400",
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Back button */}
      <button onClick={onRestart}
        className="flex items-center gap-2 mb-6 text-sm text-gray-400 hover:text-white transition-all px-4 py-2 rounded-xl border border-gray-800/50 hover:border-gray-700"
        style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
        Analyze another dataset
      </button>

      {/* Claude banner */}
      <div className="flex items-center gap-3 mb-8 px-4 py-3 rounded-xl border border-teal-500/20"
        style={{ background: "rgba(20,184,166,0.05)" }}>
        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"/>
        <p className="text-teal-400 text-sm">
          Claude generated your Gold layer — analytics-ready output with business insights
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="bg-teal-500 text-black text-sm font-bold px-3 py-1 rounded-full">GOLD</span>
        <h2 className="text-2xl font-bold">Analytics-Ready Output</h2>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl p-5 border border-gray-800/50 text-center"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-3xl font-bold text-teal-400">{data.kpis.length}</p>
          <p className="text-gray-500 text-xs mt-1">KPIs generated</p>
        </div>
        <div className="rounded-xl p-5 border border-gray-800/50 text-center"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-3xl font-bold text-blue-400">{data.charts.length}</p>
          <p className="text-gray-500 text-xs mt-1">Charts created</p>
        </div>
        <div className="rounded-xl p-5 border border-gray-800/50 text-center"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-3xl font-bold text-purple-400">{data.business_insights.length}</p>
          <p className="text-gray-500 text-xs mt-1">Business insights</p>
        </div>
        <div className="rounded-xl p-5 border border-gray-800/50 text-center"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-3xl font-bold text-green-400">3</p>
          <p className="text-gray-500 text-xs mt-1">Export formats</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {data.kpis.map((kpi, i) => (
          <div key={i} className={`rounded-xl p-5 border border-gray-800/50 border-l-4 ${kpiColors[kpi.color] || kpiColors.blue}`}
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-gray-400 text-xs mb-1">{kpi.label}</p>
            <p className={`text-xl font-bold ${kpiColors[kpi.color]?.split(" ")[1]}`}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {data.charts.map((chart, i) => (
          <div key={i} className="rounded-xl p-6 border border-gray-800/50"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 className="font-semibold mb-1">{chart.title}</h3>
            <p className="text-gray-400 text-xs mb-4">{chart.description}</p>
            <ResponsiveContainer width="100%" height={200}>
              {chart.type === "bar" ? (
                <BarChart data={chart.data}>
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }}/>
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }}/>
                  <Tooltip contentStyle={{ background: "#111827", border: "none" }}/>
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                </BarChart>
              ) : chart.type === "line" ? (
                <LineChart data={chart.data}>
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }}/>
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }}/>
                  <Tooltip contentStyle={{ background: "#111827", border: "none" }}/>
                  <Line dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false}/>
                </LineChart>
              ) : (
                <PieChart>
                  <Pie data={chart.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {chart.data.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#111827", border: "none" }}/>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Business Insights */}
      <div className="rounded-xl p-6 mb-6 border border-gray-800/50"
        style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-lg font-semibold mb-4">Business Insights</h3>
        <ul className="space-y-3">
          {data.business_insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </div>
              <span className="text-gray-300 leading-relaxed">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pipeline Code */}
      <div className="rounded-xl p-6 mb-6 border border-gray-800/50"
        style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Production Pipeline Code</h3>
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg border border-blue-500/20"
            style={{ background: "rgba(59,130,246,0.05)" }}>
            {showCode ? "Hide" : "Show"} code
          </button>
        </div>
        {showCode ? (
          <pre className="rounded-lg p-4 text-sm text-green-400 overflow-x-auto"
            style={{ background: "rgba(0,0,0,0.4)" }}>
            {data.pipeline_code}
          </pre>
        ) : (
          <p className="text-gray-500 text-sm">
            Full PySpark Gold layer code — click "Show code" to view
          </p>
        )}
      </div>

      {/* Downloads */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        <div className="rounded-2xl border border-gray-700/50 p-8"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)" }}>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-1">Export your pipeline</h3>
            <p className="text-gray-400 text-sm">
              Everything DataFlow Studio generated — ready to use in production.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button onClick={() => handleDownload("csv")}
              className="group flex flex-col gap-3 rounded-xl p-5 text-left transition-all duration-200 border border-gray-800 hover:border-blue-500/50"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <polyline points="9,15 12,18 15,15"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-0.5">Cleaned CSV</p>
                <p className="text-gray-500 text-xs leading-relaxed">Silver-transformed data, ready for analysis</p>
              </div>
              <span className="text-blue-400 text-xs font-medium group-hover:text-blue-300 transition-colors">Download →</span>
            </button>

            <button onClick={() => handleDownload("code")}
              className="group flex flex-col gap-3 rounded-xl p-5 text-left transition-all duration-200 border border-gray-800 hover:border-purple-500/50"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16,18 22,12 16,6"/>
                  <polyline points="8,6 2,12 8,18"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-0.5">Pipeline Code</p>
                <p className="text-gray-500 text-xs leading-relaxed">Full PySpark Bronze→Silver→Gold .py file</p>
              </div>
              <span className="text-purple-400 text-xs font-medium group-hover:text-purple-300 transition-colors">Download →</span>
            </button>

            <button onClick={() => handleDownload("report")}
              className="group flex flex-col gap-3 rounded-xl p-5 text-left transition-all duration-200 border border-gray-800 hover:border-teal-500/50"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-0.5">Pipeline Report</p>
                <p className="text-gray-500 text-xs leading-relaxed">Full summary of insights and transformations</p>
              </div>
              <span className="text-teal-400 text-xs font-medium group-hover:text-teal-300 transition-colors">Download →</span>
            </button>

          </div>
        </div>
      </div>

    </div>
  );
}