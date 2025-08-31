import React from "react";
import PropTypes from "prop-types";
import "../styles/Card.css";

const Card = ({ title, value, icon, color = "#007bff" }) => {
  return (
    <div className="card" style={{ borderLeft: `5px solid ${color}` }}>
      <div
        className="card-icon"
        style={{ backgroundColor: color }}
        aria-label={`${title} icon`}
      >
        {icon}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string,
};

export default Card;
