import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { supabase } from "src/services/supabase";
import { Card, Input, Button } from "src/components/common";
import { useAuth } from "src/context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthEnabled } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthEnabled) {
      alert(
        "Registration is currently disabled. Please contact the administrator."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Check if username or email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("username, email")
        .or(
          `username.eq.${formData.username.trim()},email.eq.${formData.email.trim()}`
        )
        .single();

      if (existingUser) {
        if (existingUser.username === formData.username.trim()) {
          setErrors({ username: "Username already exists" });
        } else {
          setErrors({ email: "Email already exists" });
        }
        return;
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

      // Generate UUID for the new member
      const memberUuid = `member-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Create the member
      const { data, error } = await supabase
        .from("users")
        .insert({
          uuid: memberUuid,
          username: formData.username.trim(),
          password_hash: hashedPassword,
          email: formData.email.trim(),
          full_name: formData.fullName.trim() || null,
          role: "member",
        })
        .select()
        .single();

      if (error) throw error;

      // Log registration action (include user id and visitor uuid if available)
      try {
        const { logSuccess } = await import("src/utils/logger");
        const visitorUuid = (
          await import("src/services/localStorage")
        ).getUuid();
        logSuccess(
          "User registered",
          {},
          {
            action: "register",
            actor_type: "user",
            actor_id: data.id,
            user_id: data.id,
            metadata: { username: data.username },
            visitor_uuid: visitorUuid,
          }
        );
      } catch (e) {
        console.error("Failed to log registration action:", e);
      }

      // Success - redirect to login with success message
      alert("Registration successful! Please login with your credentials.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="register">
      <div className="container">
        <Card className="register__card">
          <h1 className="register__title">Create Account</h1>
          <p className="register__subtitle">
            Join us to start your exam preparation journey
          </p>
          {!isAuthEnabled && (
            <div className="register__warning" role="alert">
              Authentication is currently disabled. Please contact the
              administrator.
            </div>
          )}

          <form onSubmit={handleSubmit} className="register__form">
            <Input
              label="Username *"
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              error={errors.username}
              placeholder="Choose a username"
              required
            />

            <Input
              label="Email *"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              placeholder="Enter your email address"
              required
            />

            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter your full name (optional)"
            />

            <Input
              label="Password *"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
              placeholder="Create a password"
              required
            />

            <Input
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
            />

            {Object.keys(errors).length > 0 && (
              <div className="register__errors">
                <p>Please fix the errors above and try again.</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              className="register__button"
              disabled={loading || !isAuthEnabled}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="register__footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="register__link">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
