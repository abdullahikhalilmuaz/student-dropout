// src/components/Sidebar.jsx
import { useState, useEffect, useRef } from "react";
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
  Server,
  Cpu,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import "../styles/sidebar.css";

function Sidebar() {
  const [reportsOpen, setReportsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);

  // System Status States
  const [backendStatus, setBackendStatus] = useState("sleeping");
  const [aiStatus, setAiStatus] = useState("sleeping");
  const [isWaking, setIsWaking] = useState(false);
  const wakeIntervalRef = useRef(null);
  const wakeTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const BACKEND_URL = "https://student-dropout-ml-server.onrender.com";
  const AI_URL = "https://ai-model-prediction.onrender.com";

  // Ping a single service with better error handling
  const pingService = async (url, timeout = 8000) => {
    try {
      const response = await axios.get(url, {
        timeout: timeout,
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        // Don't throw on any status - we just want to see if it responds
        validateStatus: () => true,
      });

      // Any response (even 404, 500, etc.) means the server is awake
      return { success: true, status: response.status, data: response.data };
    } catch (error) {
      // Only consider it a failure if it's a network error or timeout
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        return { success: false, error: "timeout" };
      }
      // If there's a response (even error response), server is online
      if (error.response) {
        return { success: true, status: error.response.status };
      }
      // Network error (DNS, connection refused, etc.)
      return { success: false, error: error.message };
    }
  };

  // Check all services and update statuses
  const checkAllServices = async () => {
    try {
      const [backendResult, aiResult] = await Promise.all([
        pingService(BACKEND_URL),
        pingService(AI_URL),
      ]);

      if (isMountedRef.current) {
        setBackendStatus(backendResult.success ? "online" : "sleeping");
        setAiStatus(aiResult.success ? "online" : "sleeping");
      }

      return { backendResult, aiResult };
    } catch (error) {
      console.error("Error checking services:", error);
      return {
        backendResult: { success: false },
        aiResult: { success: false },
      };
    }
  };

  // Initial check on mount
  useEffect(() => {
    isMountedRef.current = true;
    checkAllServices();

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (wakeIntervalRef.current) {
        clearInterval(wakeIntervalRef.current);
        wakeIntervalRef.current = null;
      }
      if (wakeTimeoutRef.current) {
        clearTimeout(wakeTimeoutRef.current);
        wakeTimeoutRef.current = null;
      }
    };
  }, []);

  // Wake services
  const wakeServices = async () => {
    // Clear any existing intervals
    if (wakeIntervalRef.current) {
      clearInterval(wakeIntervalRef.current);
      wakeIntervalRef.current = null;
    }
    if (wakeTimeoutRef.current) {
      clearTimeout(wakeTimeoutRef.current);
      wakeTimeoutRef.current = null;
    }

    setIsWaking(true);
    setBackendStatus("starting");
    setAiStatus("starting");

    // Send initial wake-up requests (these will likely timeout but wake the service)
    try {
      await Promise.allSettled([
        axios.get(BACKEND_URL, { timeout: 3000 }).catch(() => {}),
        axios.get(AI_URL, { timeout: 3000 }).catch(() => {}),
      ]);
    } catch (error) {
      // Ignore errors - just trying to wake the services
    }

    // Start polling every 5 seconds
    let attempts = 0;
    const maxAttempts = 18; // 90 seconds / 5 seconds

    wakeIntervalRef.current = setInterval(async () => {
      attempts++;

      const [backendResult, aiResult] = await Promise.all([
        pingService(BACKEND_URL, 5000),
        pingService(AI_URL, 5000),
      ]);

      if (!isMountedRef.current) return;

      // Update statuses based on results
      if (backendResult.success) {
        setBackendStatus("online");
      } else if (attempts >= maxAttempts) {
        setBackendStatus("offline");
      }

      if (aiResult.success) {
        setAiStatus("online");
      } else if (attempts >= maxAttempts) {
        setAiStatus("offline");
      }

      // Check if both are online or both failed
      const bothOnline = backendResult.success && aiResult.success;
      const bothFailed = attempts >= maxAttempts;

      if (bothOnline || bothFailed) {
        if (wakeIntervalRef.current) {
          clearInterval(wakeIntervalRef.current);
          wakeIntervalRef.current = null;
        }
        setIsWaking(false);

        // If both failed, ensure statuses are set to offline
        if (bothFailed) {
          if (!backendResult.success) setBackendStatus("offline");
          if (!aiResult.success) setAiStatus("offline");
        }
      }
    }, 5000);

    // Safety timeout - stop after 90 seconds
    wakeTimeoutRef.current = setTimeout(() => {
      if (wakeIntervalRef.current) {
        clearInterval(wakeIntervalRef.current);
        wakeIntervalRef.current = null;
      }
      if (isMountedRef.current) {
        setIsWaking(false);
        // Set any non-online statuses to offline
        setBackendStatus((prev) => (prev === "online" ? "online" : "offline"));
        setAiStatus((prev) => (prev === "online" ? "online" : "offline"));
      }
    }, 90000);
  };

  // Manual refresh status (click on status to refresh)
  const refreshStatus = async () => {
    if (isWaking) return;
    await checkAllServices();
  };

  // Get status display info
  const getStatusInfo = (status) => {
    switch (status) {
      case "online":
        return { emoji: "🟢", label: "Online", class: "status-online" };
      case "starting":
        return { emoji: "🟡", label: "Starting...", class: "status-starting" };
      case "sleeping":
        return { emoji: "⚪", label: "Sleeping", class: "status-sleeping" };
      case "offline":
        return { emoji: "🔴", label: "Offline", class: "status-offline" };
      default:
        return { emoji: "⚪", label: "Unknown", class: "status-sleeping" };
    }
  };

  // Handle window resize for mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 750;
      setIsMobile(mobile);
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
                </NavLink>
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

        {/* System Status Section */}
        <div className="sidebar-system-status">
          <div className="status-header">
            <Server size={16} />
            <span>System Status</span>
            <button
              className="status-refresh-btn"
              onClick={refreshStatus}
              disabled={isWaking}
              title="Refresh status"
            >
              <RefreshCw size={12} className={isWaking ? "spinning" : ""} />
            </button>
          </div>

          <div className="status-items">
            <div className="status-item">
              <div className="status-item-left">
                <Server size={14} />
                <span>Backend API</span>
              </div>
              <div
                className={`status-indicator ${getStatusInfo(backendStatus).class}`}
              >
                <span className="status-emoji">
                  {getStatusInfo(backendStatus).emoji}
                </span>
                <span className="status-label">
                  {getStatusInfo(backendStatus).label}
                </span>
              </div>
            </div>

            <div className="status-item">
              <div className="status-item-left">
                <Cpu size={14} />
                <span>AI Prediction</span>
              </div>
              <div
                className={`status-indicator ${getStatusInfo(aiStatus).class}`}
              >
                <span className="status-emoji">
                  {getStatusInfo(aiStatus).emoji}
                </span>
                <span className="status-label">
                  {getStatusInfo(aiStatus).label}
                </span>
              </div>
            </div>
          </div>

          <button
            className="wake-btn"
            onClick={wakeServices}
            disabled={isWaking}
          >
            <RefreshCw size={14} className={isWaking ? "spinning" : ""} />
            <span>{isWaking ? "Waking..." : "Wake Services"}</span>
          </button>
        </div>

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
