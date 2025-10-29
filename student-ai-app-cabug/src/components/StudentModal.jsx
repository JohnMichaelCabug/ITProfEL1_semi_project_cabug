import { useState, useEffect } from "react";

export default function StudentModal({ open, onClose, onSubmit, initial }) {
  const [firstName, setFirstName] = useState(initial?.first_name || "");
  const [lastName, setLastName] = useState(initial?.last_name || "");
  const [studentNumber, setStudentNumber] = useState(initial?.student_number || "");

  useEffect(() => {
    setFirstName(initial?.first_name || "");
    setLastName(initial?.last_name || "");
    setStudentNumber(initial?.student_number || "");
  }, [initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark blurred background */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="relative z-10 w-96 rounded-2xl bg-gradient-to-br from-[#0d1117] via-[#111827] to-[#1e293b] text-white shadow-2xl border border-blue-500/30 p-6 animate-fadeIn">
        <h3 className="text-2xl font-semibold mb-5 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {initial ? "✏️ Edit Student" : "➕ Add Student"}
        </h3>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-blue-500/30 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            className="w-full px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-blue-500/30 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            className="w-full px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-blue-500/30 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all"
            placeholder="Student Number"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-gray-700/60 hover:bg-gray-600/70 text-slate-200 font-medium transition-all"
          >
            Cancel
          </button>

          <button
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/40 hover:scale-[1.03] transition-transform"
            onClick={() =>
              onSubmit({
                first_name: firstName,
                last_name: lastName,
                student_number: studentNumber,
              })
            }
          >
            Save
          </button>
        </div>
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
