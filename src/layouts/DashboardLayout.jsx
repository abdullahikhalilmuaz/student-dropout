import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function DashboardLayout() {
  return (
    <div className="dashboard-container">
      <div className="main-content">
        <Header />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
