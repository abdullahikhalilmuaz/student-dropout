import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Reports() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h2>Reports</h2>
          <p>Reports page will appear here</p>
        </div>
      </div>
    </div>
  );
}

export default Reports;