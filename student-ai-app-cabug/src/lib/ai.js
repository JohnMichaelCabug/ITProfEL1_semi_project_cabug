import { GoogleGenAI } from "@google/genai";
import supabase from "./supabase";

const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function studentsAnalyzer(subjectId) {
  const { data: grades, error } = await supabase
    .from("grades")
    .select("*, students(*)")
    .eq("subject_id", subjectId);

  if (error) throw new Error(error.message);

  const rows = (grades || [])
    .map((g) => {
      const student = g.students || {};
      return `${student.first_name} ${student.last_name} | prelim: ${
        g.prelim ?? "N/A"
      } midterm: ${g.midterm ?? "N/A"} semifinal: ${
        g.semifinal ?? "N/A"
      } final: ${g.final ?? "N/A"}`;
    })
    .join("\n");

  const prompt = `
You are an educational analyst. Given these student grade records for a subject, provide:
1) A short analysis summary of class performance.
2) A list "passedStudents" (students whose final >= 75 or average >= 75).
3) A list "failedStudents".
4) Optional recommendations for interventions.

Records:
${rows}

Return the result as JSON with keys: analysis, passedStudents, failedStudents
  `;

  const result = await genAI.models.generateContent({
    model: "models/gemini-2.5-pro",
    contents: [prompt],
  });

  const text =
    result?.candidates?.[0]?.content || ""; // New response structure

  let parsed = { analysis: text, passedStudents: [], failedStudents: [] };
  try {
    const jsonStart = text.indexOf("{");
    const json = jsonStart >= 0 ? text.slice(jsonStart) : text;
    parsed = JSON.parse(json);
  } catch (e) {
    parsed.analysis = text;
  }

  return parsed;
}

export default studentsAnalyzer;
