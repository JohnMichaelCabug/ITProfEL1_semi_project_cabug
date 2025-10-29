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
    const { error } = await supabase.from("students").insert([payload]);
    if (error) toast.error(error.message);
    else {
      toast.success("Student added successfully");
      setModalOpen(false);
      fetchStudents();
    }
  }

  async function handleEdit(payload) {
    const { error } = await supabase
      .from("students")
      .update(payload)
      .eq("id", editing.id);

    if (error) toast.error(error.message);
    else {
      toast.success("Student updated successfully");
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
      toast.success("Student deleted");
      fetchStudents();
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Students</h1>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all"
        >
          + Add Student
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading students...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-gray-700 font-medium">Full Name</th>
                <th className="p-4 text-gray-700 font-medium">Student Number</th>
                <th className="p-4 text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-800">
                      {s.first_name} {s.last_name}
                    </td>
                    <td className="p-4 text-gray-800">{s.student_number}</td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => {
                          setEditing(s);
                          setModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-gray-500 text-center">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <StudentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={editing ? handleEdit : handleAdd}
          initial={editing}
        />
      )}
    </div>
  );
}
