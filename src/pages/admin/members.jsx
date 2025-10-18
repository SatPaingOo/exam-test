import React, { useState, useEffect } from "react";
import { Card, Button, Input, Pagination, Select } from "src/components/common";
import { supabase } from "src/services/supabase";
import bcrypt from "bcryptjs";
import { getUuid } from "src/services/localStorage";

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: "",
    role: "member",
  });
  const [createErrors, setCreateErrors] = useState({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredMembers.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const validateCreateForm = () => {
    const errors = {};

    if (!createForm.username.trim()) {
      errors.username = "Username is required";
    } else if (createForm.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!createForm.password) {
      errors.password = "Password is required";
    } else if (createForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (createForm.password !== createForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (createForm.email && !/\S+@\S+\.\S+/.test(createForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!createForm.role) {
      errors.role = "Role is required";
    }

    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();

    if (!validateCreateForm()) {
      return;
    }

    setCreating(true);
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createForm.password, saltRounds);

      // Generate UUID for the new member
      const memberUuid = `member-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Create the member
      const { data, error } = await supabase
        .from("users")
        .insert({
          uuid: memberUuid,
          username: createForm.username.trim(),
          password_hash: hashedPassword,
          email: createForm.email.trim() || null,
          full_name: createForm.fullName.trim() || null,
          role: createForm.role,
        })
        .select()
        .single();

      if (error) throw error;

      // Reset form and close modal
      setCreateForm({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        fullName: "",
        role: "member",
      });
      setCreateErrors({});
      setShowCreateModal(false);

      // Refresh member list
      await fetchMembers();

      // Show success message (you could add a toast notification here)
      alert("Member created successfully!");
    } catch (error) {
      console.error("Error creating member:", error);
      if (error.code === "23505") {
        // Unique constraint violation
        if (error.message.includes("username")) {
          setCreateErrors({ username: "Username already exists" });
        } else if (error.message.includes("email")) {
          setCreateErrors({ email: "Email already exists" });
        }
      } else {
        alert("Failed to create member. Please try again.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleCreateFormChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (createErrors[field]) {
      setCreateErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "role-badge--admin";
      case "member":
        return "role-badge--member";
      default:
        return "role-badge--default";
    }
  };

  if (loading) {
    return (
      <div className="admin-members">
        <div className="container">
          <div className="loading-screen">
            <p>Loading members...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-members">
      <div className="container">
        <div className="admin-members__header">
          <div className="admin-members__title-section">
            <h1 className="admin-members__title">Member Management</h1>
            <p className="admin-members__subtitle">
              View and manage all registered members
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="admin-members__create-btn"
          >
            + Create Member
          </Button>
        </div>

        <div className="admin-members__search">
          <Input
            type="text"
            placeholder="Search by username, email, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-members__search-input"
          />
        </div>

        <Card className="admin-members__card">
          <div className="admin-members__stats">
            <div className="stat-item">
              <span className="stat-value">{members.length}</span>
              <span className="stat-label">Total Members</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {members.filter((m) => m.role === "admin").length}
              </span>
              <span className="stat-label">Admins</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {members.filter((m) => m.role === "member").length}
              </span>
              <span className="stat-label">Members</span>
            </div>
          </div>

          <div className="admin-members__list">
            {paginatedMembers.length === 0 ? (
              <p className="admin-members__empty">
                {searchTerm
                  ? "No members found matching your search."
                  : "No members found."}
              </p>
            ) : (
              paginatedMembers.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-item__info">
                    <div className="member-item__primary">
                      <strong>{member.username}</strong>
                      <span
                        className={`role-badge ${getRoleBadgeClass(
                          member.role
                        )}`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <div className="member-item__secondary">
                      {member.full_name && <span>{member.full_name}</span>}
                      {member.email && <span>{member.email}</span>}
                    </div>
                  </div>
                  <div className="member-item__meta">
                    <span className="member-item__date">
                      Joined: {new Date(member.created_at).toLocaleDateString()}
                    </span>
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

        {/* Create Member Modal */}
        {showCreateModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowCreateModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Create New Member</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateMember} className="modal-body">
                <div className="form-row">
                  <Input
                    label="Username *"
                    type="text"
                    name="username"
                    value={createForm.username}
                    onChange={(e) =>
                      handleCreateFormChange("username", e.target.value)
                    }
                    error={createErrors.username}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="form-row">
                  <Input
                    label="Password *"
                    type="password"
                    name="password"
                    value={createForm.password}
                    onChange={(e) =>
                      handleCreateFormChange("password", e.target.value)
                    }
                    error={createErrors.password}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="form-row">
                  <Input
                    label="Confirm Password *"
                    type="password"
                    name="confirmPassword"
                    value={createForm.confirmPassword}
                    onChange={(e) =>
                      handleCreateFormChange("confirmPassword", e.target.value)
                    }
                    error={createErrors.confirmPassword}
                    placeholder="Confirm password"
                    required
                  />
                </div>
                <div className="form-row">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={createForm.email}
                    onChange={(e) =>
                      handleCreateFormChange("email", e.target.value)
                    }
                    error={createErrors.email}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-row">
                  <Input
                    label="Full Name"
                    type="text"
                    name="fullName"
                    value={createForm.fullName}
                    onChange={(e) =>
                      handleCreateFormChange("fullName", e.target.value)
                    }
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-row">
                  <Select
                    label="Role *"
                    name="role"
                    value={createForm.role}
                    onChange={(value) => handleCreateFormChange("role", value)}
                    error={createErrors.role}
                    options={[
                      { value: "member", label: "Member" },
                      { value: "admin", label: "Admin" },
                    ]}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={creating}>
                    {creating ? "Creating..." : "Create Member"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMembers;
