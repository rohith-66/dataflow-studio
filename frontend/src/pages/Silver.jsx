import { useEffect, useState } from "react";
import axios from "axios";

function SilverLoader() {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Reading your Bronze layer data...", color: "text-amber-400" },
    { text: "Detecting schema patterns and data types...", color: "text-amber-400" },
    { text: "Identifying data quality issues...", color: "text-amber-400" },
    { text: "Sending dataset to Claude for analysis...", color: "text-blue-400" },
    { text: "Claude is analyzing your data structure...", color: "text-blue-400" },
    { text: "Generating PySpark transformation code...", color: "text-blue-400" },
    { text: "Writing equivalent SQL queries...", color: "text-blue-400" },
    { text: "Validating transformation logic...", color: "text-purple-400" },
    { text: "Building Silver layer output...", color: "text-purple-400" },
    { text: "Almost done — finalizing transformations...", color: "text-teal-400" },
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
}, [steps.length]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"/>
        <span className="text-blue-400 text-sm font-medium">Claude is analyzing your dataset</span>
      </div>

      <div className="rounded-xl border border-blue-500/20 overflow-hidden"
        style={{ background: "rgba(0,10,30,0.6)", backdropFilter: "blur(10px)" }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-500/10"
          style={{ background: "rgba(0,5,20,0.8)" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500/60 animate-pulse"/>
          <span className="text-blue-500/60 text-xs font-mono">silver_transform.py</span>
        </div>
        <div className="p-5 font-mono text-sm space-y-2 min-h-64">
          {steps.slice(0, step + 1).map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gray-600 shrink-0">{i < step ? "✓" : "›"}</span>
              <span className={i < step ? "text-gray-600" : s.color}>{s.text}</span>
            </div>
          ))}
          {step < steps.length - 1 && (
            <span className="text-blue-400 animate-pulse ml-4">▊</span>
          )}
        </div>
      </div>

      <div className="mt-6 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-1000"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      <p className="text-gray-600 text-xs mt-2 text-right">
        {Math.round(((step + 1) / steps.length) * 100)}%
      </p>
    </div>
  );
}

export default function Silver({ bronzeData, onNext, onBack }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState({});

  useEffect(() => {
    async function fetchSilver() {
      try {
        const res = await axios.post("https://dataflow-studio-backend.onrender.com/silver/transform", {
          preview: bronzeData.preview,
          schema: bronzeData.schema,
          quality: bronzeData.quality,
          filename: bronzeData.filename,
        });
        setData(res.data);
      } catch (err) {
        setError("Silver transform failed. Check your API key.");
      } finally {
        setLoading(false);
      }
    }
    fetchSilver();
  }, [bronzeData]);

  if (loading) return <SilverLoader />;

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Back button */}
      <button onClick={onBack}
        className="flex items-center gap-2 mb-6 text-sm text-gray-400 hover:text-white transition-all px-4 py-2 rounded-xl border border-gray-800/50 hover:border-gray-700"
        style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
        Back to Bronze
      </button>

      {/* Claude banner */}
      <div className="flex items-center gap-3 mb-8 px-4 py-3 rounded-xl border border-blue-500/20"
        style={{ background: "rgba(59,130,246,0.05)" }}>
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"/>
        <p className="text-blue-400 text-sm">
          Claude analyzed your dataset and generated these transformations
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">SILVER</span>
        <h2 className="text-2xl font-bold">AI-Powered Transformations</h2>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl p-5 border border-gray-800/50 text-center"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-3xl font-bold text-blue-400">{data.transformations.length}</p>
          <p className="text-gray-500 text-xs mt-1">Transformations applied</p>
        </div>
        <div className="rounded-xl p-5 border border-gray-800/50 text-center"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-3xl font-bold text-amber-400">{data.issues.length}</p>
          <p className="text-gray-500 text-xs mt-1">Issues detected</p>
        </div>
        <div className="rounded-xl p-5 border border-gray-800/50 text-center"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-3xl font-bold text-green-400">Ready</p>
          <p className="text-gray-500 text-xs mt-1">For Gold layer</p>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl p-6 mb-6 border border-gray-800/50"
        style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-lg font-semibold mb-2">Dataset Summary</h3>
        <p className="text-gray-300 leading-relaxed">{data.summary}</p>
      </div>

      {/* Issues */}
      <div className="rounded-xl p-6 mb-6 border border-gray-800/50"
        style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-lg font-semibold mb-3">Issues Detected</h3>
        <ul className="space-y-2">
          {data.issues.map((issue, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <span className="text-amber-300/80">{issue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Transformations */}
      <div className="rounded-xl p-6 mb-6 border border-gray-800/50"
        style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-lg font-semibold mb-4">Transformations</h3>
        <div className="space-y-5">
          {data.transformations.map((t, i) => (
            <div key={i} className="rounded-xl p-5 border border-gray-700/40"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{t.name}</h4>
                  <p className="text-gray-400 text-sm mt-0.5">{t.description}</p>
                </div>
                <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0 ml-4">
                  Transform {i + 1}
                </span>
              </div>

              <div className="flex gap-1.5 mb-3 p-1 rounded-lg w-fit"
                style={{ background: "rgba(0,0,0,0.3)" }}>
                <button
                  onClick={() => setActiveTab(prev => ({ ...prev, [i]: "pyspark" }))}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all font-medium ${
                    (activeTab[i] || "pyspark") === "pyspark"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}>
                  PySpark
                </button>
                <button
                  onClick={() => setActiveTab(prev => ({ ...prev, [i]: "sql" }))}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all font-medium ${
                    activeTab[i] === "sql"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}>
                  SQL
                </button>
              </div>

              <pre className="rounded-lg p-4 text-sm text-green-400 overflow-x-auto"
                style={{ background: "rgba(0,0,0,0.4)" }}>
                {(activeTab[i] || "pyspark") === "pyspark" ? t.pyspark_code : t.sql_code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => onNext(data)}
        className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3 rounded-xl transition-all">
        Continue to Gold Layer →
      </button>

    </div>
  );
}