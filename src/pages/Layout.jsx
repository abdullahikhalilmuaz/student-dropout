// src/pages/Layout.jsx
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Layout() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h2>Layout</h2>
          <p>Layout customization will appear here</p>
        </div>
      </div>
    </div>
  );
}

export default Layout;