export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1020] text-slate-200 relative overflow-hidden">
      {/* Subtle animated radial background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-0 w-[60vw] h-[60vh] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-20 blur-3xl animate-blob"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.18), transparent 30%), radial-gradient(circle at 70% 70%, rgba(14,165,233,0.12), transparent 30%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-3xl px-6 py-10">
        {/* Glass card */}
        <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] backdrop-blur-md shadow-2xl shadow-black/60 overflow-hidden">
          {/* Top gradient border / neon strip */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(99,102,241,0.9), rgba(14,165,233,0.9), rgba(236,72,153,0.9))",
              filter: "blur(6px)",
              opacity: 0.9,
            }}
          />

          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar with soft ring + glow (smaller aesthetic size) */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src="profile.jpg"
                  alt="Your photo"
                  className="w-10 h-10 md:w-20 md:h-20 rounded-full object-cover ring-2 ring-[rgba(99,102,241,0.25)] shadow-[0_8px_30px_rgba(99,102,241,0.18)] transition-all duration-300 hover:scale-105"
                />
                <span
                  className="absolute -bottom-2 -right-2 w-3.5 h-3.5 rounded-full"
                  style={{
                    boxShadow: "0 0 10px 3px rgba(14,165,233,0.55)",
                    background: "rgba(14,165,233,0.9)",
                    border: "2px solid rgba(11,16,32,0.8)",
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white">
                John Michael R. Cabug
              </h1>

              <p className="mt-4 text-slate-300 max-w-prose leading-relaxed">
                I started my IT journey in first year... (write your story here — what you learned, frameworks you like, a short paragraph).
              </p>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/students"
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-transform transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                    boxShadow:
                      "0 6px 18px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.02)",
                    border: "1px solid rgba(99,102,241,0.12)",
                    color: "white",
                  }}
                >
                  <span className="text-[13px]">Students</span>
                  <span
                    className="ml-2 inline-block w-2 h-2 rounded-full"
                    style={{
                      background: "linear-gradient(180deg,#60a5fa,#06b6d4)",
                      boxShadow: "0 0 10px rgba(6,182,212,0.6)",
                    }}
                  />
                </a>

                <a
                  href="/subjects"
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-transform transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                    boxShadow:
                      "0 6px 18px rgba(14,165,233,0.10), inset 0 1px 0 rgba(255,255,255,0.02)",
                    border: "1px solid rgba(14,165,233,0.10)",
                    color: "white",
                  }}
                >
                  <span className="text-[13px]">Subjects</span>
                </a>

                <a
                  href="/grades"
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-transform transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                    boxShadow:
                      "0 6px 18px rgba(236,72,153,0.10), inset 0 1px 0 rgba(255,255,255,0.02)",
                    border: "1px solid rgba(236,72,153,0.10)",
                    color: "white",
                  }}
                >
                  <span className="text-[13px]">Grades</span>
                </a>
              </div>

              {/* Metadata row */}
              <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 012 0v4a1 1 0 11-2 0v-4zM8 7a1 1 0 012 0v8a1 1 0 11-2 0V7zM14 4a1 1 0 012 0v11a1 1 0 11-2 0V4z" />
                  </svg>
                  <span>Full-stack · React · Supabase</span>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 3h14v2H3V3zm0 4h10v2H3V7zm0 4h14v2H3v-2z" />
                  </svg>
                  <span>Portfolio — modern UI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom subtle footer / glow */}
          <div
            className="h-6 w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(99,102,241,0.04), transparent)",
            }}
          />
        </div>
      </div>

      {/* Small animation keyframes */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(-20px, -10px) scale(1); }
          33% { transform: translate(10px, 20px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.95); }
          100% { transform: translate(-20px, -10px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
