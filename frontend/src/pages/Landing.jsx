import { useRef } from "react";

const TECH = [
  { name: "PySpark", color: "#E25A1C", slug: "apachespark" },
  { name: "BigQuery", color: "#4285F4", slug: "googlebigquery" },
  { name: "SQL", color: "#4479A1", slug: "mysql" },
  { name: "Anthropic", color: "#CC785C", slug: "anthropic" },
  { name: "GCP", color: "#4285F4", slug: "googlecloud" },
  { name: "Python", color: "#3776AB", slug: "python" },
  { name: "Pandas", color: "#6E4C9F", slug: "pandas" },
  { name: "Docker", color: "#2496ED", slug: "docker" },
  { name: "FastAPI", color: "#009688", slug: "fastapi" },
];

const FEATURES = [
  {
    title: "Smart Profiling",
    desc: "Detects nulls, duplicates, type mismatches, and schema issues the moment you upload.",
    color: "#f59e0b",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  },
  {
    title: "AI Transformations",
    desc: "Claude reads your data, understands its structure, and writes real PySpark and SQL — not templates.",
    color: "#60a5fa",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>
  },
  {
    title: "Gold Layer Analytics",
    desc: "Auto-generates KPIs, charts, and business insights from your analytics-ready data.",
    color: "#2dd4bf",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  },
];

export default function Landing({ onStart }) {
  const canvasRef = useRef(null);

  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, rgba(0,0,0,0) 60%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%), #060610" }}>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes flow { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
      `}</style>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}/>

      {/* Floating navbar */}
      <div className="relative z-10 flex justify-center pt-5 px-6">
        <nav className="flex items-center gap-6 px-5 py-2.5 rounded-2xl border border-gray-700/50"
          style={{
            background: "rgba(10,10,20,0.7)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 40px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.05)",
            width: "fit-content"
          }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">DF</div>
            <span className="font-semibold text-sm">DataFlow Studio</span>
          </div>
          <div className="w-px h-4 bg-gray-700"/>
          <span className="text-gray-500 text-xs hidden md:block">Bronze → Silver → Gold</span>
          <div className="w-px h-4 bg-gray-700"/>
          <button onClick={onStart}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-xl transition-all text-xs font-medium">
            Try it free
          </button>
        </nav>
      </div>

      {/* Hero — two column */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-4 py-1.5 rounded-full mb-6">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"/>
              Built for Data Engineers
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Upload any CSV.{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                Watch it flow
              </span>{" "}
              through a full pipeline.
            </h1>

            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Bronze → Silver → Gold. Claude AI detects issues, applies transformations,
              and generates production-ready PySpark and SQL code — instantly.
            </p>

            <button onClick={onStart}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl transition-all text-lg shadow-lg shadow-blue-500/20">
              Upload your CSV →
            </button>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-10 pt-10 border-t border-gray-800/50">
              <div>
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-gray-500 text-xs mt-0.5">Pipeline layers</p>
              </div>
              <div className="w-px h-8 bg-gray-800"/>
              <div>
                <p className="text-2xl font-bold text-white">AI</p>
                <p className="text-gray-500 text-xs mt-0.5">Powered transforms</p>
              </div>
              <div className="w-px h-8 bg-gray-800"/>
              <div>
                <p className="text-2xl font-bold text-white">Any</p>
                <p className="text-gray-500 text-xs mt-0.5">CSV dataset</p>
              </div>
            </div>
          </div>

          {/* Right — pipeline visual */}
          <div className="hidden md:flex items-center justify-center">
            <div style={{ animation: "float 6s ease-in-out infinite" }} className="w-full">
              <svg viewBox="0 0 400 340" className="w-full">
                <defs>
                  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round"/>
                  </marker>
                </defs>

                {/* Upload */}
                <rect x="20" y="130" width="80" height="50" rx="10" fill="rgba(31,41,55,0.8)" stroke="rgba(75,85,99,0.5)" strokeWidth="1"/>
                <text x="60" y="152" textAnchor="middle" fill="#9ca3af" fontSize="9" fontWeight="500">UPLOAD</text>
                <text x="60" y="167" textAnchor="middle" fill="#6b7280" fontSize="8">Any CSV</text>
                <line x1="100" y1="155" x2="118" y2="155" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arr)"/>

                {/* Bronze */}
                <rect x="120" y="100" width="80" height="110" rx="10" fill="rgba(120,53,15,0.3)" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5"/>
                <text x="160" y="128" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700">BRONZE</text>
                <text x="160" y="144" textAnchor="middle" fill="#d97706" fontSize="7">Schema detection</text>
                <text x="160" y="158" textAnchor="middle" fill="#d97706" fontSize="7">Null analysis</text>
                <text x="160" y="172" textAnchor="middle" fill="#d97706" fontSize="7">Quality score</text>
                <text x="160" y="186" textAnchor="middle" fill="#92400e" fontSize="7">Data profiling</text>
                <line x1="200" y1="155" x2="218" y2="155" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arr)" strokeDasharray="15" style={{ animation: "flow 1.5s linear infinite" }}/>

                {/* Silver */}
                <rect x="220" y="80" width="80" height="150" rx="10" fill="rgba(29,78,216,0.2)" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5"/>
                <text x="260" y="108" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="700">SILVER</text>
                <text x="260" y="124" textAnchor="middle" fill="#3b82f6" fontSize="7">AI transforms</text>
                <text x="260" y="138" textAnchor="middle" fill="#3b82f6" fontSize="7">Type casting</text>
                <text x="260" y="152" textAnchor="middle" fill="#3b82f6" fontSize="7">Deduplication</text>
                <text x="260" y="166" textAnchor="middle" fill="#3b82f6" fontSize="7">PySpark code</text>
                <text x="260" y="180" textAnchor="middle" fill="#1d4ed8" fontSize="7">SQL generation</text>
                <text x="260" y="194" textAnchor="middle" fill="#1d4ed8" fontSize="7">dbt transforms</text>
                <text x="260" y="208" textAnchor="middle" fill="#1e3a8a" fontSize="7">Null handling</text>
                <line x1="300" y1="155" x2="318" y2="155" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arr)" strokeDasharray="15" style={{ animation: "flow 1.5s linear infinite 0.5s" }}/>

                {/* Gold */}
                <rect x="320" y="100" width="65" height="110" rx="10" fill="rgba(4,120,87,0.2)" stroke="rgba(20,184,166,0.5)" strokeWidth="1.5"/>
                <text x="352" y="128" textAnchor="middle" fill="#2dd4bf" fontSize="9" fontWeight="700">GOLD</text>
                <text x="352" y="144" textAnchor="middle" fill="#14b8a6" fontSize="7">KPIs</text>
                <text x="352" y="158" textAnchor="middle" fill="#14b8a6" fontSize="7">Charts</text>
                <text x="352" y="172" textAnchor="middle" fill="#14b8a6" fontSize="7">Insights</text>
                <text x="352" y="186" textAnchor="middle" fill="#0f766e" fontSize="7">Export</text>

                
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pb-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-800/50">
          {FEATURES.map((f) => (
            <div key={f.title} className="px-8 py-10 flex flex-col gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-white text-base">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      

      {/* Code preview */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pb-16">
        <h2 className="text-2xl font-bold text-center mb-3">Real code. Not pseudocode.</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Every transformation generates production-ready PySpark you can drop straight into your pipeline.</p>
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-950/80">
            <div className="w-3 h-3 rounded-full bg-red-500/70"/>
            <div className="w-3 h-3 rounded-full bg-amber-500/70"/>
            <div className="w-3 h-3 rounded-full bg-green-500/70"/>
            <span className="text-gray-500 text-xs ml-2">silver_transform.py</span>
          </div>
          <pre className="p-6 text-sm overflow-x-auto text-left">
            <code>
              <span className="text-purple-400">from</span><span className="text-white"> pyspark.sql </span><span className="text-purple-400">import</span><span className="text-white"> SparkSession{"\n"}</span>
              <span className="text-purple-400">from</span><span className="text-white"> pyspark.sql.functions </span><span className="text-purple-400">import</span><span className="text-white"> col, to_date, when{"\n\n"}</span>
              <span className="text-gray-500"># Silver layer — AI-generated transformations{"\n"}</span>
              <span className="text-white">df = spark.read.parquet(</span><span className="text-green-400">"s3://bronze/data"</span><span className="text-white">){"\n\n"}</span>
              <span className="text-gray-500"># Fix date columns{"\n"}</span>
              <span className="text-white">df = df.withColumn(</span><span className="text-green-400">"Order Date"</span><span className="text-white">, to_date(col(</span><span className="text-green-400">"Order Date"</span><span className="text-white">), </span><span className="text-green-400">"dd/MM/yyyy"</span><span className="text-white">)){"\n"}</span>
              <span className="text-gray-500"># Handle nulls{"\n"}</span>
              <span className="text-white">df = df.fillna({"{"}</span><span className="text-green-400">"Postal Code"</span><span className="text-white">: </span><span className="text-green-400">"UNKNOWN"</span><span className="text-white">{"}"});{"\n\n"}</span>
              <span className="text-white">df.write.parquet(</span><span className="text-green-400">"s3://silver/data"</span><span className="text-white">)</span>
            </code>
          </pre>
        </div>
      </div>

      {/* About */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pb-16">
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-8 text-center backdrop-blur-sm">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">R</div>
          <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
            Built by <span className="text-white font-medium">Ro</span> — MS Data Science @ ASU.
            DataFlow Studio was built to make data engineering pipelines visual, interactive, and accessible.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="https://linkedin.com/in/rohithsrinivasa" target="_blank" rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm transition-all">LinkedIn →</a>
            <a href="https://github.com/rohithsrinivasa" target="_blank" rel="noreferrer"
              className="text-gray-400 hover:text-gray-300 text-sm transition-all">GitHub →</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-gray-800/50 px-8 py-4 text-center text-gray-600 text-xs">
        Built with Claude AI · DataFlow Studio · {new Date().getFullYear()}
      </div>

      {/* Fixed bottom dock */}
      <div className="fixed bottom-6 left-1/2 z-50" style={{ transform: "translateX(-50%)" }}>
        <div className="flex items-end gap-3 px-6 py-3 rounded-3xl border border-white/10"
          style={{
            background: "rgba(20,20,30,0.75)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
          }}>
          {TECH.map((tech) => (
            <div key={tech.name}
              className="relative flex flex-col items-center"
              style={{ transition: "transform 0.15s ease" }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-14px) scale(1.35)";
                e.currentTarget.querySelector('.tip').style.opacity = "1";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.querySelector('.tip').style.opacity = "0";
              }}
            >
              <div className="tip absolute -top-9 bg-gray-900 border border-gray-700 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap pointer-events-none"
                style={{ opacity: 0, transition: "opacity 0.15s" }}>
                {tech.name}
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(145deg, ${tech.color}30, ${tech.color}15)`,
                  border: `1px solid ${tech.color}40`,
                  boxShadow: `0 2px 12px ${tech.color}25`
                }}>
                <img
                  src={`https://cdn.simpleicons.org/${tech.slug}`}
                  alt={tech.name}
                  width="26"
                  height="26"
                  style={{ filter: "brightness(1.3) saturate(1.2)" }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="w-1 h-1 rounded-full bg-white/30 mt-1.5"/>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}