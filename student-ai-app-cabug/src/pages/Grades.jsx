import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import supabase from "../lib/supabase";
import studentsAnalyzer from "../lib/ai";
import AnalysisPDF from "../components/AnalysisPDF";


export default function Grades() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [gradesMap, setGradesMap] = useState({});
  const [aiResult, setAiResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchStudents();
  }, []);

  async function fetchSubjects() {
    const { data } = await supabase
      .from("subjects")
      .select("*")
      .order("created_at", { ascending: false });
    setSubjects(data || []);
  }

  async function fetchStudents() {
    const { data } = await supabase
      .from("students")
      .select("*")
      .order("last_name");
    setStudents(data || []);
  }

  function setGrade(studentId, field, value) {
    setGradesMap((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || {}), [field]: value },
    }));
  }

  async function saveGrades() {
    if (!selectedSubject) return toast.error("Select a subject first");
    const toUpsert = Object.entries(gradesMap).map(([studentId, g]) => ({
      ...g,
      student_id: studentId,
      subject_id: selectedSubject,
    }));
    const { error } = await supabase
      .from("grades")
      .upsert(toUpsert, { onConflict: ["student_id", "subject_id"] });
    if (error) toast.error(error.message);
    else toast.success("Grades saved successfully");
  }

  async function generateAIReport() {
    if (!selectedSubject) return toast.error("Select a subject first");

    setLoadingAI(true);
    try {
      const res = await studentsAnalyzer(selectedSubject);

      const rawText =
        typeof res === "string"
          ? res
          : res?.candidates?.[0]?.content?.parts?.[0]?.text ||
            res?.analysis?.parts?.[0]?.text ||
            "";

      const cleaned = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = { analysis: cleaned };
      }

      const formatted = {
        analysis: parsed.analysis || "No analysis text provided.",
        passedStudents: parsed.passedStudents || [],
        failedStudents: parsed.failedStudents || [],
      };

      setAiResult(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI report");
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#111827] to-[#1e293b] text-white p-8">
      {/* Header */}
      <h1 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        📘 Grades Management
      </h1>

      {/* Subject Selector */}
      <div className="mb-6">
        <label className="block mb-2 text-slate-300 font-medium">
          Select Subject
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-64 px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-blue-500/40 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all"
        >
          <option value="">-- Choose Subject --</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id} className="text-black">
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grades Table */}
      <div className="overflow-x-auto rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/10 bg-[rgba(255,255,255,0.03)]">
        <table className="w-full text-left text-slate-200">
          <thead className="bg-[rgba(255,255,255,0.06)] border-b border-blue-500/20">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Prelim</th>
              <th className="p-3">Midterm</th>
              <th className="p-3">Semifinal</th>
              <th className="p-3">Final</th>
            </tr>
          </thead>
          <tbody>
            {students.map((st) => {
              const g = gradesMap[st.id] || {};
              return (
                <tr
                  key={st.id}
                  className="border-b border-blue-500/10 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <td className="p-3">
                    {st.first_name} {st.last_name}
                  </td>
                  {["prelim", "midterm", "semifinal", "final"].map((field) => (
                    <td key={field} className="p-2">
                      <input
                        className="w-24 px-2 py-1.5 rounded-md bg-[rgba(255,255,255,0.1)] border border-blue-500/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={g[field] || ""}
                        onChange={(e) =>
                          setGrade(st.id, field, e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={saveGrades}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 font-semibold text-white shadow-lg shadow-green-500/40 hover:scale-[1.03] transition-transform"
        >
          💾 Save Grades
        </button>

        <button
          onClick={generateAIReport}
          disabled={loadingAI}
          className={`px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 font-semibold text-white shadow-lg shadow-indigo-500/40 hover:scale-[1.03] transition-transform ${
            loadingAI ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loadingAI ? "⏳ Generating..." : "🤖 Generate AI Report"}
        </button>
      </div>

      {/* AI Report Section */}
      {aiResult && (
        <div className="mt-10 bg-[rgba(255,255,255,0.05)] p-6 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <h2 className="text-2xl font-semibold mb-3 text-cyan-300">
            AI Analysis Report -{" "}
            {subjects.find((s) => s.id === selectedSubject)?.name}
          </h2>

          <div className="text-slate-300 mb-6 leading-relaxed whitespace-pre-line">
            <strong>AI Summary:</strong>
            <p className="mt-2">{aiResult.analysis}</p>

            <br />
            <strong>
              Passed Students ({aiResult.passedStudents.length}):
            </strong>
            <ul className="list-disc ml-6">
              {aiResult.passedStudents.length > 0 ? (
                aiResult.passedStudents.map((name, i) => (
                  <li key={i}>{name}</li>
                ))
              ) : (
                <li>None</li>
              )}
            </ul>

            <br />
            <strong>
              Failed Students ({aiResult.failedStudents.length}):
            </strong>
            <ul className="list-disc ml-6">
              {aiResult.failedStudents.length > 0 ? (
                aiResult.failedStudents.map((name, i) => (
                  <li key={i}>{name}</li>
                ))
              ) : (
                <li>None</li>
              )}
            </ul>
          </div>

          {/* PDF Section */}
          <div className="space-y-4">
            {/* PDF Preview */}
            <PDFViewer width="100%" height="600">
              <AnalysisPDF
                result={aiResult}
                subjectName={
                  subjects.find((s) => s.id === selectedSubject)?.name || ""
                }
              />
            </PDFViewer>

            {/* ✅ Fixed Download PDF Button */}
            <PDFDownloadLink
              key={selectedSubject}
              document={
                <AnalysisPDF
                  result={aiResult}
                  subjectName={
                    subjects.find((s) => s.id === selectedSubject)?.name || ""
                  }
                />
              }
              fileName={`AI_Report_${
                subjects.find((s) => s.id === selectedSubject)?.name || "report"
              }.pdf`}
            >
              {({ loading, error }) =>
                loading ? (
                  <button className="mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-500 font-semibold text-white opacity-80 cursor-wait">
                    Preparing PDF...
                  </button>
                ) : error ? (
                  <button
                    onClick={() => toast.error("Failed to prepare PDF")}
                    className="mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-500 font-semibold text-white"
                  >
                    ❌ Error Generating PDF
                  </button>
                ) : (
                  <button className="mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-white shadow-md shadow-blue-500/40 hover:scale-[1.03] transition-transform">
                    📄 Download PDF
                  </button>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
}
