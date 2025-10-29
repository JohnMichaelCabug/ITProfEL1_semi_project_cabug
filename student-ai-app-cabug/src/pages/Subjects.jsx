import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import toast from "react-hot-toast";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "" });

  async function fetchSubjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error(error.message);
    else setSubjects(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchSubjects(); }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      toast.error("Please fill all fields");
      return;
    }
    if (editing) {
      const { error } = await supabase
        .from("subjects")
        .update(formData)
        .eq("id", editing.id);
      if (error) toast.error(error.message);
      else toast.success("Subject updated");
    } else {
      const { error } = await supabase.from("subjects").insert([formData]);
      if (error) toast.error(error.message);
      else toast.success("Subject added");
    }
    setModalOpen(false);
    setEditing(null);
    setFormData({ name: "", code: "" });
    fetchSubjects();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this subject?")) return;
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Subject deleted");
      fetchSubjects();
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 p-6 relative overflow-hidden">
      {/* Background glow */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 w-[70vw] h-[70vh] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-20 blur-3xl animate-blob"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(circle at 70% 70%, rgba(14,165,233,0.15), transparent 40%)",
          }}
        />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
          📚 Subjects
        </h1>
        <button
          onClick={() => { setEditing(null); setFormData({ name: "", code: "" }); setModalOpen(true); }}
          className="mt-4 md:mt-0 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-indigo-700/30 hover:scale-[1.03] transition-transform duration-200"
        >
          + Add Subject
        </button>
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-md shadow-2xl shadow-black/60">
        {loading ? (
          <div className="p-6 text-center text-slate-400">Loading...</div>
        ) : subjects.length === 0 ? (
          <div className="p-6 text-center text-slate-400">No subjects found</div>
        ) : (
          <table className="w-full table-auto text-left text-slate-300">
            <thead className="bg-[rgba(255,255,255,0.05)] text-slate-300 uppercase text-sm tracking-wider">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id} className="border-t border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                  <td className="px-6 py-3">{s.name}</td>
                  <td className="px-6 py-3">{s.code}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => { setEditing(s); setFormData({ name: s.name, code: s.code }); setModalOpen(true); }}
                      className="text-blue-400 hover:text-blue-300 mr-4 transition-colors"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-rose-500 hover:text-rose-400 transition-colors"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer glow */}
      <div className="mt-10 h-1 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 blur-[2px] opacity-60" />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative z-10 w-96 rounded-2xl bg-gradient-to-br from-[#0d1117] via-[#111827] to-[#1e293b] text-white shadow-2xl border border-blue-500/30 p-6 animate-fadeIn">
            <h3 className="text-2xl font-semibold mb-5 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {editing ? "✏️ Edit Subject" : "➕ Add Subject"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subject Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-blue-500/30 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all"
              />
              <input
                type="text"
                placeholder="Subject Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-blue-500/30 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-lg bg-gray-700/60 hover:bg-gray-600/70 text-slate-200 font-medium transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/40 hover:scale-[1.03] transition-transform">
                Save
              </button>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            @keyframes blob {
              0% { transform: translate(-20px, -10px) scale(1); }
              33% { transform: translate(10px, 20px) scale(1.05); }
              66% { transform: translate(-10px, 10px) scale(0.95); }
              100% { transform: translate(-20px, -10px) scale(1); }
            }
            .animate-blob { animation: blob 9s infinite ease-in-out; }
          `}</style>
        </div>
      )}
    </div>
  );
}
