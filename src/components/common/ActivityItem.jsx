import React from "react";
import PropTypes from "prop-types";

const ActivityItem = ({ user, action, time }) => {
  return (
    <div className="activity-item">
      <div className="activity-item__content">
        <strong>{user}</strong> {action}
      </div>
      <div className="activity-item__time">{time}</div>
    </div>
  );
};

ActivityItem.propTypes = {
  user: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default ActivityItem;
