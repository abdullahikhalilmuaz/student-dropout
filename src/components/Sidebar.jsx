// src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Upload,
  FileText,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Building2,
  Layers,
  PieChart,
  Menu,
  X,
} from "lucide-react";
import "../styles/sidebar.css";

function Sidebar() {
  const [reportsOpen, setReportsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 750;
      setIsMobile(mobile);
      // Auto-close sidebar when resizing to desktop
      if (!mobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen && isMobile ? "show" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <GraduationCap size={32} />
          <h2>DropoutPredict</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <Users size={20} />
            <span>Students</span>
          </NavLink>

          <NavLink
            to="/add-student"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <UserPlus size={20} />
            <span>Add Student</span>
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <Upload size={20} />
            <span>Upload Excel</span>
          </NavLink>

          <div className="nav-section">
            <div
              className={`nav-section-header ${reportsOpen ? "open" : ""}`}
              onClick={() => setReportsOpen(!reportsOpen)}
            >
              <FileText size={20} />
              <span className="reports-icon">Reports</span>
              {reportsOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>

            {reportsOpen && (
              <div className="nav-section-items">
                <NavLink
                  to="/reports/high-risk"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeSidebar}
                >
                  <AlertTriangle size={16} />
                  <span>High Risk Students</span>
                </NavLink>
                <NavLink
                  to="/reports/faculty"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeSidebar}
                >
                  <Building2 size={16} />
                  <span>Faculty Analysis</span>
                </NavLink>
                <NavLink
                  to="/reports/department"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeSidebar}
                >
                  <Layers size={16} />
                  <span>Department Analysis</span>
                |</NavLink>
                <NavLink
                  to="/reports/summary"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeSidebar}
                >
                  <PieChart size={16} />
                  <span>Risk Summary</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user">
            <div className="avatar">A</div>
            <div>
              <p>Admin User</p>
              <small>Administrator</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;