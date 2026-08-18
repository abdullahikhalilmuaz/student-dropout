import { Bell, Search, User } from "lucide-react";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h2>Student Dropout Prediction System</h2>
      </div>

      <div className="header-right">
        {/* <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div> */}

        <button className="icon-btn">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}
