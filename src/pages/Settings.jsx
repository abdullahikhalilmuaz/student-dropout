// src/pages/Settings.jsx
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Settings() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h2>Settings</h2>
          <p>Settings page will appear here</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;