import React, { useState, useEffect } from "react";
import { Card, Button, Input, Pagination } from "src/components/common";
import { supabase } from "src/services/supabase";

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId) => {
    if (!confirm("Are you sure you want to terminate this session?")) return;

    try {
      const { error } = await supabase
        .from("quiz_sessions")
        .update({ finished: true })
        .eq("id", sessionId);

      if (error) throw error;

      // Refresh sessions
      fetchSessions();
      alert("Session terminated successfully");
    } catch (error) {
      console.error("Error terminating session:", error);
      alert("Failed to terminate session");
    }
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.track.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.paper.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredSessions.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="admin-sessions">
        <div className="container">
          <div className="loading-screen">
            <p>Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-sessions">
      <div className="container">
        <div className="admin-sessions__header">
          <h1 className="admin-sessions__title">Quiz Sessions Management</h1>
          <p className="admin-sessions__subtitle">
            Monitor and manage active quiz sessions
          </p>
        </div>

        <div className="admin-sessions__search">
          <Input
            type="text"
            placeholder="Search by session code, UUID, track, or paper..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-sessions__search-input"
          />
        </div>

        <Card className="admin-sessions__card">
          <div className="admin-sessions__stats">
            <div className="stat-item">
              <span className="stat-value">{sessions.length}</span>
              <span className="stat-label">Total Sessions</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {sessions.filter((s) => !s.finished).length}
              </span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {sessions.filter((s) => s.finished).length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="admin-sessions__list">
            {paginatedSessions.length === 0 ? (
              <p className="admin-sessions__empty">
                {searchTerm
                  ? "No sessions found matching your search."
                  : "No sessions found."}
              </p>
            ) : (
              paginatedSessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-item__info">
                    <div className="session-item__primary">
                      <strong>Session: {session.code}</strong>
                      <span
                        className={`status-badge ${
                          session.finished
                            ? "status-badge--completed"
                            : "status-badge--active"
                        }`}
                      >
                        {session.finished ? "Completed" : "Active"}
                      </span>
                    </div>
                    <div className="session-item__secondary">
                      <span>
                        {session.track} - {session.paper}
                      </span>
                      <span>UUID: {session.uuid}</span>
                    </div>
                  </div>
                  <div className="session-item__meta">
                    <div className="session-item__details">
                      <span>
                        Questions:{" "}
                        {session.questions
                          ? Object.keys(session.questions).length
                          : 0}
                      </span>
                      <span>
                        Answers:{" "}
                        {session.answers
                          ? Object.keys(session.answers).length
                          : 0}
                      </span>
                      {session.time_spent && (
                        <span>
                          Time: {Math.floor(session.time_spent / 60)}m{" "}
                          {session.time_spent % 60}s
                        </span>
                      )}
                    </div>
                    <div className="session-item__actions">
                      <span className="session-item__date">
                        Created: {new Date(session.created_at).toLocaleString()}
                      </span>
                      {!session.finished && (
                        <Button
                          onClick={() => terminateSession(session.id)}
                          variant="danger"
                          size="small"
                        >
                          Terminate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalItems > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminSessions;
