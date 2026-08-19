// src/pages/AddStudent.jsx
import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { X, AlertTriangle, CheckCircle } from "lucide-react";
import "../styles/add.css";

function AddStudent() {
  const [formData, setFormData] = useState({
    matricNo: "",
    fullName: "",
    faculty: "",
    department: "",
    level: "",
    gender: "",
    age: "",
    cgpa: "",
    attendance: "",
    carryovers: "",
    feesPaid: false,
  });

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const resultRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredictionResult(null);

    try {
      setLoading(true);
      const res = await api.post("/students", formData);

      setPredictionResult({
        risk: res.data.riskLevel,
        probability: res.data.probability,
      });

      setFormData({
        matricNo: "",
        fullName: "",
        faculty: "",
        department: "",
        level: "",
        gender: "",
        age: "",
        cgpa: "",
        attendance: "",
        carryovers: "",
        feesPaid: false,
      });

      // Auto-scroll to result after it renders
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    } catch (err) {
      console.error(err);
      alert("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeResult = () => {
    setPredictionResult(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Header />
      <div className="main-content">
        <div className="dashboard-content">
          <div className="add-student-container">
            <h2>Add New Student</h2>
            <p>
              Enter student information and get AI-powered dropout risk
              prediction
            </p>

            {/* Student Information Section */}
            <div className="section-header">
              <h3>Student Information</h3>
              <p>Fill in all required fields to generate accurate prediction</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Matric No *</label>
                  <input
                    name="matricNo"
                    placeholder="e.g. UMRUC3C/003"
                    value={formData.matricNo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Faculty</label>
                  <input
                    name="faculty"
                    placeholder="Enter faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    name="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Level</label>
                  <input
                    type="number"
                    name="level"
                    placeholder="e.g., 100, 200"
                    value={formData.level}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgpa"
                    placeholder="e.g., 3.50"
                    value={formData.cgpa}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Attendance (%)</label>
                  <input
                    type="number"
                    name="attendance"
                    placeholder="Enter attendance percentage"
                    value={formData.attendance}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Carryovers</label>
                  <input
                    type="number"
                    name="carryovers"
                    placeholder="Number of carryovers"
                    value={formData.carryovers}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="feesPaid"
                      checked={formData.feesPaid}
                      onChange={handleChange}
                    />
                    Fees Paid
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Student"}
              </button>
            </form>

            {/* AI Prediction Result - New Design */}
            {predictionResult && (
              <div
                ref={resultRef}
                className={`prediction-result-card ${predictionResult.risk.toLowerCase()}`}
              >
                <button className="close-result-btn" onClick={closeResult}>
                  <X size={20} />
                </button>

                <div className="prediction-header">
                  <h3>AI Prediction Result</h3>
                  <span className="prediction-subtitle">
                    Risk assessment using Machine Learning
                  </span>
                </div>

                <div className="prediction-risk-badge">
                  <div
                    className={`risk-level-badge ${predictionResult.risk.toLowerCase()}`}
                  >
                    {predictionResult.risk}
                  </div>
                </div>

                <div className="prediction-details-grid">
                  <div className="prediction-detail-item">
                    <span className="detail-label">Risk Level</span>
                    <span
                      className={`detail-value risk ${predictionResult.risk.toLowerCase()}`}
                    >
                      {predictionResult.risk}
                    </span>
                  </div>
                  <div className="prediction-detail-item">
                    <span className="detail-label">Probability Score</span>
                    <span className="detail-value probability">
                      {predictionResult.probability}%
                    </span>
                  </div>
                </div>

                <div
                  className={`prediction-warning ${predictionResult.risk.toLowerCase()}`}
                >
                  <AlertTriangle size={18} />
                  <p>
                    <strong>
                      This student has a {predictionResult.risk} probability of
                      dropout.
                    </strong>
                    <br />
                    Taking IMMEDIATE attention is always recommended.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
