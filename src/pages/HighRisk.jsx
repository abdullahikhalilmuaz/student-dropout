// src/pages/HighRiskStudents.jsx
import { useEffect, useState } from "react";
import { Eye, AlertTriangle, Users, UserCircle } from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RiskBadge from "../components/RiskBadge";
import "../styles/highrisk.css";

function HighRiskStudents() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/reports/high-risk");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching high risk students:", error);
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
            <h2>Loading high risk students...</h2>
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
          <div className="highrisk-header">
            <h2>High Risk Students</h2>
            <p>Students at High Risk of Dropping Out</p>
          </div>

          <div className="highrisk-stats">
            <div className="stat-card blue">
              <div className="stat-icon"><Users size={24} /></div>
              <div>
                <h3>Total High Risk</h3>
                <p className="stat-value">{data?.totalHighRisk || 0}</p>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon"><Users size={24} /></div>
              <div>
                <h3>Male High Risk</h3>
                <p className="stat-value">{data?.maleHighRisk || 0}</p>
              </div>
            </div>
            <div className="stat-card pink">
              <div className="stat-icon"><UserCircle size={24} /></div>
              <div>
                <h3>Female High Risk</h3>
                <p className="stat-value">{data?.femaleHighRisk || 0}</p>
              </div>
            </div>
          </div>

          <div className="highrisk-table-container">
            <table className="highrisk-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Matric No</th>
                  <th>Full Name</th>
                  <th>Faculty</th>
                  <th>Department</th>
                  <th>CGPA</th>
                  <th>Probability</th>
                  <th>Risk</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.topHighRiskStudents?.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.matricNo}</td>
                    <td>{student.fullName}</td>
                    <td>{student.faculty || "N/A"}</td>
                    <td>{student.department || "N/A"}</td>
                    <td>{student.cgpa?.toFixed(2) || "N/A"}</td>
                    <td className="probability">
                      <span className="progress-bar">
                        <span 
                          className="progress-fill" 
                          style={{ width: `${student.probability || 0}%` }}
                        ></span>
                      </span>
                      <span className="probability-value">
                        {student.probability || 0}%
                      </span>
                    </td>
                    <td><RiskBadge risk={student.riskLevel} /></td>
                    <td className="actions">
                      <button className="action-btn view" title="View">
                        <Eye size={16} />
                      </button>
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

export default HighRiskStudents;