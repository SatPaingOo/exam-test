import React, { useState, useEffect } from "react";
import { Card, Button, Input, Select, Pagination } from "src/components/common";
import { supabase } from "src/services/supabase";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("logs")
        .select("*")
        .order("occurred_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesType = !filterType || log.type === filterType;
    const matchesSearch =
      !searchTerm ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.page?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Pagination logic
  const totalItems = filteredLogs.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchTerm]);

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "error":
        return "log-type--error";
      case "success":
        return "log-type--success";
      case "info":
        return "log-type--info";
      case "warning":
        return "log-type--warning";
      default:
        return "log-type--default";
    }
  };

  const uniqueTypes = [...new Set(logs.map((log) => log.type))];

  if (loading) {
    return (
      <div className="admin-logs">
        <div className="container">
          <div className="loading-screen">
            <p>Loading logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-logs">
      <div className="container">
        <div className="admin-logs__header">
          <h1 className="admin-logs__title">System Logs</h1>
          <p className="admin-logs__subtitle">
            Monitor system activity and troubleshoot issues
          </p>
        </div>

        <div className="admin-logs__filters">
          <div className="admin-logs__filter-group">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: "", label: "All Types" },
                ...uniqueTypes.map((type) => ({
                  value: type,
                  label: type.toUpperCase(),
                })),
              ]}
              className="admin-logs__filter-select"
            />
            <Input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-logs__search-input"
            />
          </div>
          <Button onClick={fetchLogs} variant="secondary">
            Refresh
          </Button>
        </div>

        <Card className="admin-logs__card">
          <div className="admin-logs__stats">
            <div className="stat-item">
              <span className="stat-value">{logs.length}</span>
              <span className="stat-label">Total Logs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {logs.filter((l) => l.type === "error").length}
              </span>
              <span className="stat-label">Errors</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {logs.filter((l) => l.type === "success").length}
              </span>
              <span className="stat-label">Success</span>
            </div>
          </div>

          <div className="admin-logs__list">
            {paginatedLogs.length === 0 ? (
              <p className="admin-logs__empty">
                {searchTerm || filterType
                  ? "No logs found matching your filters."
                  : "No logs found."}
              </p>
            ) : (
              paginatedLogs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-item__header">
                    <span className={`log-type ${getTypeBadgeClass(log.type)}`}>
                      {log.type.toUpperCase()}
                    </span>
                    <span className="log-item__timestamp">
                      {new Date(
                        log.occurred_at || log.timestamp
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="log-item__content">
                    <p className="log-item__message">{log.message}</p>
                    <div className="log-item__meta">
                      {log.page && <span>Page: {log.page}</span>}
                      {log.action && <span>Action: {log.action}</span>}
                      {log.user_id && <span>User ID: {log.user_id}</span>}
                      {log.visitor_uuid && (
                        <span>UUID: {log.visitor_uuid}</span>
                      )}
                      {log.actor_type && <span>Actor: {log.actor_type}</span>}
                    </div>
                    {log.details && (
                      <details className="log-item__details">
                        <summary>Details</summary>
                        <pre>{JSON.stringify(log.details, null, 2)}</pre>
                      </details>
                    )}
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

export default AdminLogs;
