// src/components/Card.jsx
import React from "react";
import PropTypes from "prop-types";
import "../styles/Card.css";

// ✅ Card wrapper
const Card = ({ children, className = "" }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

// ✅ Card content wrapper
const CardContent = ({ children, className = "" }) => {
  return <div className={`card-content ${className}`}>{children}</div>;
};

// ✅ PropTypes
Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

// ✅ Exports
export { Card, CardContent };
