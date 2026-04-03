import { useEffect, useState } from "react";

export default function Bronze({ data, onNext, onBack }) {
  const [termLines, setTermLines] = useState([]);

  useEffect(() => {
    const warningLines = data.quality
      .filter(q => q.null_count > 0)
      .map(q => `> Warning: ${q.column} has ${q.null_count} nulls (${q.null_pct}%)`);
  
    const lines = [
      `> Ingesting ${data.filename}...`,
      `> Detected ${data.cols} columns, ${data.rows} rows`,
      `> Running schema analysis...`,
      `> Schema analysis complete ✓`,
      `> Checking null values across all columns...`,
      ...warningLines,
      `> Null check complete ✓`,
      `> Scanning for duplicate rows...`,
      `> Duplicate check complete ✓`,
      `> Data quality score computed ✓`,
      `> Bronze layer complete — click Silver to run AI transforms →`,
    ].filter(Boolean);
  
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTermLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 180);
  
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Back button */}
      <button onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm text-gray-400 hover:text-white transition-all px-4 py-2 rounded-xl border border-gray-800/50 hover:border-gray-700"
        style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
        Start over
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="bg-amber-500 text-black text-sm font-bold px-3 py-1 rounded-full">BRONZE</span>
        <h2 className="text-2xl font-bold">Raw Data Profile</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl p-5 border border-gray-800/50" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-gray-400 text-sm">Filename</p>
          <p className="text-white font-semibold mt-1">{data.filename}</p>
        </div>
        <div className="rounded-xl p-5 border border-gray-800/50" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-gray-400 text-sm">Rows</p>
          <p className="text-white font-semibold mt-1">{data.rows}</p>
        </div>
        <div className="rounded-xl p-5 border border-gray-800/50" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-gray-400 text-sm">Columns</p>
          <p className="text-white font-semibold mt-1">{data.cols}</p>
        </div>
      </div>

      {/* Schema */}
      <div className="rounded-xl p-6 mb-6 border border-gray-800/50" style={{ background: "rgba(255,255,255,0.03)" }}>
        <h3 className="text-lg font-semibold mb-4">Schema</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left pb-2">Column</th>
              <th className="text-left pb-2">Type</th>
              <th className="text-left pb-2">Nulls</th>
              <th className="text-left pb-2">Null %</th>
              <th className="text-left pb-2">Unique</th>
            </tr>
          </thead>
          <tbody>
            {data.quality.map((col) => (
              <tr key={col.column} className="border-b border-gray-800">
                <td className="py-2 text-white">{col.column}</td>
                <td className="py-2 text-blue-400">
                  {data.schema.find((s) => s.column === col.column)?.dtype}
                </td>
                <td className="py-2 text-white">{col.null_count}</td>
                <td className={`py-2 ${col.null_pct > 0 ? "text-amber-400" : "text-green-400"}`}>
                  {col.null_pct}%
                </td>
                <td className="py-2 text-white">{col.unique_values}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview */}
      <div className="rounded-xl p-6 mb-6 border border-gray-800/50 overflow-x-auto" style={{ background: "rgba(255,255,255,0.03)" }}>
        <h3 className="text-lg font-semibold mb-4">Data Preview (first 10 rows)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              {Object.keys(data.preview[0]).map((key) => (
                <th key={key} className="text-left pb-2 pr-4">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.preview.map((row, i) => (
              <tr key={i} className="border-b border-gray-800">
                {Object.values(row).map((val, j) => (
                  <td key={j} className={`py-2 pr-4 ${val === "NULL" ? "text-red-400" : "text-white"}`}>
                    {String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terminal */}
      <div className="rounded-xl mb-8 border border-green-500/20 overflow-hidden"
        style={{ background: "rgba(0,20,0,0.4)", backdropFilter: "blur(10px)" }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-green-500/10"
          style={{ background: "rgba(0,10,0,0.5)" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60 animate-pulse"/>
          <span className="text-green-500/60 text-xs font-mono">bronze_pipeline.log</span>
        </div>
        <div className="p-4 font-mono text-xs space-y-1 min-h-32">
        {termLines.filter(Boolean).map((line, i) => (
  <div key={i} className={`${
    line.includes("Warning") ? "text-amber-400" :
    line.includes("✓") ? "text-green-400" :
    line.includes("→") ? "text-blue-400 font-semibold" :
    "text-green-600"
  }`}>
    {line}
  </div>
))}
          {termLines.length < 8 && (
            <span className="text-green-400 animate-pulse">▊</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <button onClick={onNext}
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-all">
        Continue to Silver Layer →
      </button>
    </div>
  );
}