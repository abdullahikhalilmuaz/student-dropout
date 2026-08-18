// import "../pages/statscard.css";

function StatCard({ title, value, subtitle, color, icon: Icon }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{Icon && <Icon size={24} />}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {subtitle && <small className="stat-subtitle">{subtitle}</small>}
      </div>
    </div>
  );
}

export default StatCard;
