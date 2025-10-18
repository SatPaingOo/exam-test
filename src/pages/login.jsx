import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { supabase } from "src/services/supabase";
import { getUuid } from "src/services/localStorage";
import { Card, Input, Button } from "src/components/common";
import { useAuth } from "src/context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Query user from Supabase
      const { data: user, error: queryError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (queryError) {
        console.error("Supabase query error while fetching user:", queryError);
        setError("Invalid username or password");
        return;
      }

      if (!user) {
        setError("Invalid username or password");
        return;
      }

      // Verify password
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(password, user.password_hash);
      } catch (pwErr) {
        console.error("Error while comparing password:", pwErr);
        setError("Invalid username or password");
        return;
      }

      if (!isValidPassword) {
        setError("Invalid username or password");
        return;
      }

      // Login user and update visitor role
      // defensive: login may be sync or async in future
      try {
        await Promise.resolve(login(user));
      } catch (loginErr) {
        console.error("Error during local login():", loginErr);
        // proceed — user state may still be set, but surface an error
      }
      const visitorUuid = getUuid();
      if (visitorUuid) {
        const deviceType = (() => {
          try {
            const ua = navigator.userAgent || "";
            if (/Mobi|Android/i.test(ua)) return "mobile";
            if (/Tablet|iPad/i.test(ua)) return "tablet";
            return "desktop";
          } catch (e) {
            return "unknown";
          }
        })();

        const { error: updateVisitorError } = await supabase
          .from("visitors")
          .update({
            role: user.role,
            user_id: user.id,
            device_type: deviceType,
          })
          .eq("uuid", visitorUuid);

        if (updateVisitorError) {
          console.error(
            "Failed to update visitor after login:",
            updateVisitorError
          );
        }
      }

      // Log login success
      try {
        const { logSuccess } = await import("src/utils/logger");
        logSuccess(
          "User logged in",
          {},
          {
            action: "login",
            actor_type: "user",
            actor_id: user.id,
            user_id: user.id,
          }
        );
      } catch (e) {
        console.error("Failed to log login action:", e);
      }

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/member/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="login">
      <div className="container">
        <Card className="login__card">
          <h1 className="login__title">Login</h1>
          <form onSubmit={handleSubmit} className="login__form">
            <Input
              label="Username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            {error && <p className="login__error">{error}</p>}
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              className="login__button"
            >
              Login
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
