-- Database Schema for ITPEC Exam Test
-- Current implementation: visitors, users, logs, and quiz_sessions tables

-- Drop tables in reverse dependency order (to avoid foreign key constraints)
DROP TABLE IF EXISTS quiz_sessions;
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS users;

-- Users table (for authenticated admin/member accounts) - Create FIRST (no dependencies)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  uuid TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitors table (UUID tracking for all site visitors) - Create SECOND (references users)
CREATE TABLE IF NOT EXISTS visitors (
  id BIGSERIAL PRIMARY KEY,
  uuid TEXT UNIQUE NOT NULL,
  user_id BIGINT REFERENCES users(id),
  role TEXT,
  device_type TEXT DEFAULT 'unknown', -- e.g. 'desktop' | 'mobile' | 'tablet' | 'bot' | 'unknown'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Action logs: centralized table for recording visitor and user actions
-- This table stores both human-readable fields and structured JSON metadata
CREATE TABLE IF NOT EXISTS logs (
  id BIGSERIAL PRIMARY KEY,
  occurred_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- optional actor fields to support different actor types (user, visitor, system)
  actor_type TEXT,         -- e.g. 'user' | 'visitor' | 'system'
  actor_id BIGINT,        -- numeric id for the actor when applicable
  user_id BIGINT REFERENCES users(id), -- direct FK for quick user-based queries
  visitor_uuid TEXT,      -- visitor uuid when the actor is an anonymous visitor

  -- action classification
  action TEXT NOT NULL,   -- short action name, e.g. 'login', 'register', 'start_quiz', 'submit_answer'
  page TEXT,              -- logical page or route where the action occurred
  type TEXT,              -- optional type/category for the log (e.g. 'auth', 'error', 'activity')
  message TEXT,          -- human-readable message

  -- optional structured data
  details JSONB,         -- free-form details (small objects)
  metadata JSONB,        -- normalized metadata (used for filtering / reporting)

  -- transport / request info
  ip INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes to speed up common log queries
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_actor ON logs(actor_type, actor_id);
CREATE INDEX IF NOT EXISTS idx_logs_occurred_at ON logs(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_page_action ON logs(page, action);
CREATE INDEX IF NOT EXISTS idx_logs_details_gin ON logs USING GIN (details);

-- Quiz sessions table (for storing quiz attempts)
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  uuid TEXT NOT NULL,
  user_id BIGINT REFERENCES users(id),
  track TEXT NOT NULL,
  paper TEXT NOT NULL,
  finished BOOLEAN DEFAULT FALSE,
  questions JSONB NOT NULL,
  answers JSONB DEFAULT '[]'::jsonb,
  summary JSONB,
  time_spent INTEGER, -- in seconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin user
-- Password is properly hashed using bcrypt
-- Default password: admin123 (already hashed below)
INSERT INTO users (uuid, username, password_hash, email, full_name, role)
VALUES (
  'admin-default-uuid-12345',
  'admin',
  '$2b$10$lC2NRgfuM/RpKWA7ad5RuetIlhheccFr/WjquoI7uzYoCGZaSlHTa', -- hashed password for 'admin123'
  'admin@examtest.com',
  'System Administrator',
  'admin'
)
ON CONFLICT (username) DO NOTHING;

-- Insert default member (testing) account
INSERT INTO users (uuid, username, password_hash, email, full_name, role)
VALUES (
  'member-default-uuid-12345',
  'member',
  '$2b$10$lC2NRgfuM/RpKWA7ad5RuetIlhheccFr/WjquoI7uzYoCGZaSlHTa', -- NOTE: same hashed password as admin for testing; change in prod
  'member@examtest.com',
  'Test Member',
  'member'
)
ON CONFLICT (username) DO NOTHING;

-- Example usage: inserting logs
-- Log a visitor viewing the homepage
-- INSERT INTO logs (actor_type, visitor_uuid, action, page, type, message, ip, user_agent, details)
-- VALUES ('visitor', 'visitor-uuid-xxxx', 'view', '/', 'activity', 'visitor viewed homepage', '203.0.113.5', 'Mozilla/5.0 ...', '{"ref": "google"}');

-- Log a user login event
-- INSERT INTO logs (actor_type, actor_id, user_id, action, page, type, message, ip, user_agent, metadata)
-- VALUES ('user', 42, 42, 'login', '/auth/login', 'auth', 'user logged in', '203.0.113.5', 'Mozilla/5.0 ...', '{"method": "password"}');