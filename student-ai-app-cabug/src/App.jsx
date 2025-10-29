import { BrowserRouter, Routes, Route } from "react-router";
import Landing from "./pages/Landing";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import Grades from "./pages/Grades";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/students" element={<Students />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/grades" element={<Grades />} />
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}
