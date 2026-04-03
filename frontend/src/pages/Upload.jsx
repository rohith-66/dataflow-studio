import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function Upload({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://dataflow-studio-backend.onrender.com/bronze/upload", formData);
      onUploadSuccess(res.data);
    } catch (err) {
      setError("Upload failed. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-4 py-1.5 rounded-full mb-6 w-fit mx-auto">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"/>
            Step 1 of 4 — Upload your dataset
          </div>
          <h1 className="text-4xl font-bold mb-3">Drop your CSV file</h1>
          <p className="text-gray-400 text-lg">Any CSV works — messy data welcome. We'll clean it for you.</p>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`relative rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-blue-400 bg-blue-500/5"
              : "border-gray-700 hover:border-gray-500"
          }`}
          style={{ background: isDragActive ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.02)" }}
        >
          <input {...getInputProps()} />

          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
              <p className="text-blue-400 text-lg">Processing your data...</p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17,8 12,3 7,8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="text-blue-400 text-lg font-medium">Drop it here</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border border-gray-700 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17,8 12,3 7,8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <p className="text-white text-lg font-medium mb-1">Drag & drop your CSV here</p>
                <p className="text-gray-500 text-sm">or click to browse your files</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-600 bg-gray-800/50 px-2 py-1 rounded">.csv</span>
                <span className="text-xs text-gray-600">files only</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-center mt-4 text-sm">{error}</p>
        )}

        {/* What happens next */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { stage: "Bronze", color: "#f59e0b", desc: "Schema detection, null analysis, quality scoring" },
            { stage: "Silver", color: "#60a5fa", desc: "AI-powered cleaning, PySpark & SQL code generation" },
            { stage: "Gold", color: "#2dd4bf", desc: "KPIs, charts, business insights, export" },
          ].map((s) => (
            <div key={s.stage} className="rounded-xl p-4 border border-gray-800/50 flex flex-col gap-2"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full w-fit"
                style={{ background: `${s.color}20`, color: s.color }}>
                {s.stage}
              </span>
              <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}