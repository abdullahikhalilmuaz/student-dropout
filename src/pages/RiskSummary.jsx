// src/pages/RiskSummary.jsx
import { useEffect, useState } from "react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/risksummary.css";

function RiskSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/reports/risk-summary");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching risk summary:", error);
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
            <h2>Loading risk summary...</h2>
          </div>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "High Risk", value: data?.highRisk || 0 },
    { name: "Low Risk", value: data?.lowRisk || 0 },
  ];

  const COLORS = ["#FF4444", "#00C851"];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <div className="risksummary-header">
            <h2>Risk Summary</h2>
            <p>Overall Risk Summary</p>
          </div>

          <div className="risksummary-stats">
            <div className="stat-card blue">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div>
                <h3>Total Students</h3>
                <p className="stat-value">{data?.totalStudents || 0}</p>
              </div>
            </div>
            <div className="stat-card danger">
              <div className="stat-icon">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3>High Risk</h3>
                <p className="stat-value">{data?.highRisk || 0}</p>
                <small>{data?.percentageHighRisk || 0}%</small>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3>Low Risk</h3>
                <p className="stat-value">{data?.lowRisk || 0}</p>
                <small>{data?.percentageLowRisk || 0}%</small>
              </div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3>Average Risk Score</h3>
                <p className="stat-value">{data?.percentageHighRisk || 0}%</p>
                <small>High risk percentage</small>
              </div>
            </div>
          </div>

          <div className="risksummary-chart">
            <h3>Overall Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RePieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskSummary;
