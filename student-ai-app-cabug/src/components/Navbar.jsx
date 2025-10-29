import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex gap-4">
        <Link to="/" className="font-bold">Home</Link>
        <Link to="/students">Students</Link>
        <Link to="/subjects">Subjects</Link>
        <Link to="/grades">Grades</Link>
      </div>
    </nav>
  );
}
