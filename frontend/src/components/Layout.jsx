export default function Layout({ children, stage }) {
    return (
      <div className="min-h-screen text-white overflow-x-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, rgba(0,0,0,0) 60%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%), #060610" }}>
  
        {/* Subtle grid overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}/>
  
        {/* Floating navbar */}
        <div className="relative z-10 flex justify-center pt-5 px-6">
          <nav className="flex items-center justify-between gap-8 px-5 py-2.5 rounded-2xl border border-gray-700/50"
            style={{
              background: "rgba(10,10,20,0.7)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.05)",
              width: "fit-content",
              minWidth: "480px"
            }}>
  
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">DF</div>
              <span className="font-semibold text-sm">DataFlow Studio</span>
            </div>
  
            <div className="w-px h-4 bg-gray-700"/>
  
            {/* Pipeline progress */}
            {stage && (
              <div className="flex items-center gap-1.5 text-xs">
                {["upload", "bronze", "silver", "gold"].map((s, i, arr) => {
                  const colors = {
                    upload: "text-gray-300",
                    bronze: "text-amber-400",
                    silver: "text-blue-400",
                    gold: "text-teal-400"
                  };
                  const isDone = arr.indexOf(s) < arr.indexOf(stage);
                  const isCurrent = s === stage;
                  return (
                    <div key={s} className="flex items-center gap-1.5">
                      <span className={`font-medium capitalize transition-all ${
                        isCurrent ? colors[s] : isDone ? "text-gray-600 line-through" : "text-gray-700"
                      }`}>
                        {s}
                      </span>
                      {i < arr.length - 1 && <span className="text-gray-700">→</span>}
                    </div>
                  );
                })}
              </div>
            )}
  
            <div className="w-px h-4 bg-gray-700"/>
            <div className="shrink-0 w-4"/>
          </nav>
        </div>
  
        {/* Page content */}
        <div className="relative z-10">
          {children}
        </div>
  
      </div>
    );
  }