import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "../../components/common";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "1,234", change: "+12%", trend: "up" },
    { title: "Total Exams", value: "15", change: "+3", trend: "up" },
    { title: "Total Questions", value: "10,000+", change: "+250", trend: "up" },
    { title: "Active Today", value: "456", change: "+8%", trend: "up" },
  ];

  const recentActivities = [
    {
      user: "John Doe",
      action: "Completed ITPEC IP exam",
      time: "2 minutes ago",
    },
    {
      user: "Jane Smith",
      action: "Started ITPEC FE exam",
      time: "5 minutes ago",
    },
    {
      user: "Mike Johnson",
      action: "Registered new account",
      time: "10 minutes ago",
    },
    {
      user: "Sarah Wilson",
      action: "Completed ITPEC AP exam",
      time: "15 minutes ago",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-dashboard__header">
          <h1 className="admin-dashboard__title">Admin Dashboard</h1>
          <p className="admin-dashboard__subtitle">
            Manage users, exams, and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="admin-dashboard__stats">
          {stats.map((stat, index) => (
            <Card key={index} className="stat-card">
              <div className="stat-card__content">
                <h3 className="stat-card__title">{stat.title}</h3>
                <div className="stat-card__value">{stat.value}</div>
                <div
                  className={`stat-card__change stat-card__change--${stat.trend}`}
                >
                  {stat.change}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="admin-dashboard__section">
          <h2 className="admin-dashboard__section-title">Quick Actions</h2>
          <div className="admin-dashboard__actions">
            <Link to="/admin/users">
              <Button variant="primary" size="medium">
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/questions">
              <Button variant="primary" size="medium">
                Manage Questions
              </Button>
            </Link>
            <Link to="/admin/exams">
              <Button variant="primary" size="medium">
                Manage Exams
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="secondary" size="medium">
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-dashboard__section">
          <h2 className="admin-dashboard__section-title">Recent Activity</h2>
          <Card>
            <div className="activity-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-item__content">
                    <strong>{activity.user}</strong> {activity.action}
                  </div>
                  <div className="activity-item__time">{activity.time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
