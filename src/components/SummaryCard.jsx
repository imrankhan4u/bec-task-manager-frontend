import React from "react";
import "../pages/Dashboard/Dashboard.css";

const SummaryCard = ({ icon, title, count }) => {
  return (
    <div className="summary-card">
      <div className="card-icon">{icon}</div>
      <div className="card-info">
        <h4>{title}</h4>
        <p>{count}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
