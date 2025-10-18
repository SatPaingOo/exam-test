import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";

const StatCard = ({ title, value, change, trend, icon, className = "" }) => {
  return (
    <Card className={`stat-card ${className}`}>
      <div className="stat-card__content">
        {icon && <div className="stat-card__icon">{icon}</div>}
        <h3 className="stat-card__title">{title}</h3>
        <div className="stat-card__value">{value}</div>
        <div className={`stat-card__change stat-card__change--${trend}`}>
          {change}
        </div>
      </div>
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string,
  trend: PropTypes.oneOf(["up", "down", "neutral"]),
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default StatCard;
