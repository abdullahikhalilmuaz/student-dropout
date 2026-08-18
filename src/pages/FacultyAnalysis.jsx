// src/pages/FacultyAnalysis.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/facultyanalysis.css";

function FacultyAnalysis() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/reports/department-analysis");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching faculty analysis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="loading-state">
            <h2>Loading faculty analysis...</h2>
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
          <div className="faculty-header">
            <h2>Faculty Analysis</h2>
            <p>High Risk Analysis by Faculty</p>
          </div>

          <div className="faculty-table-container">
            <table className="faculty-table">
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Total Students</th>
                  <th>High Risk Students</th>
                  <th>High Risk (%)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((faculty) => (
                  <tr key={faculty._id}>
                    <td>{faculty._id || "Unknown"}</td>
                    <td>{faculty.totalStudents}</td>
                    <td>{faculty.highRiskStudents}</td>
                    <td>
                      <div className="percentage-bar">
                        <span 
                          className="percentage-fill" 
                          style={{ width: `${faculty.highRiskPercentage || 0}%` }}
                        ></span>
                        <span className="percentage-value">
                          {faculty.highRiskPercentage || 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyAnalysis;