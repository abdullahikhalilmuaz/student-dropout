import "../styles/riskbadge.css";

function RiskBadge({ risk }) {
  const getRiskClass = (risk) => {
    if (!risk) return "unknown";
    const r = risk.toLowerCase();
    if (r === "high" || r === "high risk") return "high";
    if (r === "medium" || r === "medium risk") return "medium";
    if (r === "low" || r === "low risk") return "low";
    return "unknown";
  };

  return (
    <span className={`risk-badge ${getRiskClass(risk)}`}>
      {risk || "Unknown"}
    </span>
  );
}

export default RiskBadge;