// src/pages/DepartmentAnalysis.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/facultyanalysis.css";

function DepartmentAnalysis() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/reports/department-analysis");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching department analysis:", error);
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
            <h2>Loading department analysis...</h2>
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
            <h2>Department Analysis</h2>
            <p>High Risk Analysis by Department</p>
          </div>

          <div className="faculty-table-container">
            <table className="faculty-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Students</th>
                  <th>High Risk Students</th>
                  <th>High Risk (%)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((dept) => (
                  <tr key={dept._id}>
                    <td>{dept._id || "Unknown"}</td>
                    <td>{dept.totalStudents}</td>
                    <td>{dept.highRiskStudents}</td>
                    <td>
                      <div className="percentage-bar">
                        <span 
                          className="percentage-fill" 
                          style={{ width: `${dept.highRiskPercentage || 0}%` }}
                        ></span>
                        <span className="percentage-value">
                          {dept.highRiskPercentage || 0}%
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

export default DepartmentAnalysis;