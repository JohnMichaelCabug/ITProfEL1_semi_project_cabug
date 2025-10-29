import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import StudentModal from "../components/StudentModal";
import toast from "react-hot-toast";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchStudents() {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setStudents(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleAdd(payload) {
    const { error } = await supabase.from("students").insert([payload]).select();
    if (error) toast.error(error.message);
    else {
      toast.success("Student added");
      setModalOpen(false);
      fetchStudents();
    }
  }

  async function handleEdit(payload) {
    const { error } = await supabase
      .from("students")
      .update(payload)
      .eq("id", editing.id)
      .select();
    if (error) toast.error(error.message);
    else {
      toast.success("Student updated");
      setEditing(null);
      setModalOpen(false);
      fetchStudents();
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this student?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      fetchStudents();
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 relative overflow-hidden">
      {/* Animated glowing background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-0 w-[70vw] h-[70vh] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-20 blur-3xl animate-blob"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(circle at 70% 70%, rgba(14,165,233,0.15), transparent 40%)",
          }}
        />
      </div>

      {/* Page container */}
      <div className="relative mx-auto max-w-6xl p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
            🎓 Student Records
          </h1>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="mt-4 md:mt-0 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-indigo-700/30 hover:scale-[1.03] transition-transform duration-200"
          >
            + Add Student
          </button>
        </div>

        {/* Table card */}
        <div className="rounded-2xl overflow-hidden bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-md shadow-2xl shadow-black/60">
          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading...</div>
          ) : students.length === 0 ? (
            <div className="p-6 text-center text-slate-400">No students found.</div>
          ) : (
            <table className="w-full table-auto text-left text-slate-300">
              <thead className="bg-[rgba(255,255,255,0.05)] text-slate-300 uppercase text-sm tracking-wider">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Student #</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                  >
                    <td className="px-6 py-3">{s.first_name} {s.last_name}</td>
                    <td className="px-6 py-3">{s.student_number}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditing(s);
                          setModalOpen(true);
                        }}
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

        {/* Footer glow strip */}
        <div className="mt-10 h-1 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 blur-[2px] opacity-60" />
      </div>

      {/* Animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(-20px, -10px) scale(1); }
          33% { transform: translate(10px, 20px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.95); }
          100% { transform: translate(-20px, -10px) scale(1); }
        }
        .animate-blob {
          animation: blob 9s infinite ease-in-out;
        }
      `}</style>

      {/* Modal */}
      <StudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={editing ? handleEdit : handleAdd}
        initial={editing}
      />
    </div>
  );
}
