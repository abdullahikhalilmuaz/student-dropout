// src/App.jsx
import { BrowserRouter, Routes, Router, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Student";
import AddStudent from "./pages/AddStudent";
import Upload from "./pages/UploadExcel";
import HighRiskStudents from "./pages/HighRisk";
import FacultyAnalysis from "./pages/FacultyAnalysis";
import DepartmentAnalysis from "./pages/DepartmentAnalysis";
import RiskSummary from "./pages/RiskSummary";
import Settings from "./pages/Settings";
// import Layout from "./pages/Layout";
import Header from "./components/Header";
import DashboardLayout from "./layouts/DashboardLayout";
import "./styles/global.css";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <BrowserRouter>
      <>
        <div className="app-shell">
          <Sidebar />
          <div className="app-body">
            <main className="dashboard-main">
              <Routes>
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/add-student" element={<AddStudent />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route
                    path="/reports/high-risk"
                    element={<HighRiskStudents />}
                  />
                  <Route
                    path="/reports/faculty"
                    element={<FacultyAnalysis />}
                  />
                  <Route
                    path="/reports/department"
                    element={<DepartmentAnalysis />}
                  />
                  <Route path="/reports/summary" element={<RiskSummary />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Routes>
            </main>
          </div>
        </div>
      </>
    </BrowserRouter>
  );
}
