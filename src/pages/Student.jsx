// src/pages/Students.jsx
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RiskBadge from "../components/RiskBadge";
import "../styles/students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students");
      setStudents(response.data);
      setTotalStudents(response.data.length);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/students/${id}`);
        setStudents(students.filter((student) => student._id !== id));
        alert("Student deleted successfully!");
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student");
      }
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricNo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk =
      filterRisk === "all" ||
      student.riskLevel?.toLowerCase() === filterRisk.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="loading-state">
            <h2>Loading students...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <div className="students-header">
            <h2>Students</h2>
            <div className="students-actions">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by name or matric no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-box">
                <Filter size={18} />
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="high">High Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
            </div>
          </div>

          <div className="students-table-container">
            <div className="table-wrapper">
              {" "}
              {/* ← ADD THIS WRAPPER */}
              <table className="students-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Matric No</th>
                    <th>Full Name</th>
                    <th>Faculty</th>
                    <th>Department</th>
                    <th>Level</th>
                    <th>CGPA</th>
                    <th>Risk Level</th>
                    <th>Probability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student, index) => (
                    <tr key={student._id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{student.matricNo}</td>
                      <td>{student.fullName}</td>
                      <td>{student.faculty || "N/A"}</td>
                      <td>{student.department || "N/A"}</td>
                      <td>{student.level || "N/A"}</td>
                      <td>{student.cgpa?.toFixed(2) || "N/A"}</td>
                      <td>
                        <RiskBadge risk={student.riskLevel} />
                      </td>
                      <td>
                        {student.probability
                          ? `${student.probability}%`
                          : "N/A"}
                      </td>
                      <td className="actions">
                        <button className="action-btn view" title="View">
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(student._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>{" "}
            {/* ← CLOSE WRAPPER */}
          </div>

          {filteredStudents.length === 0 && (
            <div className="no-students">
              <p>No students found</p>
            </div>
          )}

          {filteredStudents.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Students;
