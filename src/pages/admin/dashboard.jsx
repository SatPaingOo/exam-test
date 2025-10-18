import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, StatCard, ActivityItem } from "src/components/common";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: "👥",
    },
    {
      title: "Total Exams",
      value: "15",
      change: "+3",
      trend: "up",
      icon: "📝",
    },
    {
      title: "Total Questions",
      value: "10,000+",
      change: "+250",
      trend: "up",
      icon: "❓",
    },
    {
      title: "Active Today",
      value: "456",
      change: "+8%",
      trend: "up",
      icon: "🔥",
    },
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
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="admin-dashboard__section">
          <h2 className="admin-dashboard__section-title">Quick Actions</h2>
          <div className="admin-dashboard__actions">
            <Link to="/admin/members">
              <Button variant="primary" size="medium">
                Manage Members
              </Button>
            </Link>
            <Link to="/admin/sessions">
              <Button variant="primary" size="medium">
                Manage Sessions
              </Button>
            </Link>
            <Link to="/admin/logs">
              <Button variant="primary" size="medium">
                View Logs
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
                <ActivityItem
                  key={index}
                  user={activity.user}
                  action={activity.action}
                  time={activity.time}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
