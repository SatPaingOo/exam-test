#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log("🗄️  ITPEC Exam Test - Database Initialization");
console.log("============================================\n");

// Check if .env is configured
if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === "your_supabase_project_url_here"
) {
  console.log("⚠️  .env file not configured properly!");
  console.log(
    "Please update your .env file with actual Supabase credentials:\n"
  );
  console.log("VITE_SUPABASE_URL=your_actual_supabase_url");
  console.log("VITE_SUPABASE_ANON_KEY=your_actual_anon_key\n");
  console.log(
    "Get these from: https://supabase.com/dashboard -> Your Project -> Settings -> API\n"
  );
  process.exit(1);
}

console.log("✅ .env file configured");
console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Read the schema file
const schemaPath = path.join(__dirname, "schema.sql");

if (!fs.existsSync(schemaPath)) {
  console.error("❌ schema.sql file not found!");
  process.exit(1);
}

const schemaSQL = fs.readFileSync(schemaPath, "utf8");

async function initializeDatabase() {
  console.log("📋 Copy and run this SQL in your Supabase SQL Editor:\n");
  console.log("=".repeat(60));
  console.log(schemaSQL);
  console.log("=".repeat(60));
  console.log("\n🚀 Steps:");
  console.log("1. Go to https://supabase.com/dashboard");
  console.log("2. Select your project");
  console.log("3. Go to SQL Editor");
  console.log("4. Paste the SQL above");
  console.log('5. Click "Run"');
  console.log("\n✅ This will create the visitors and users tables!\n");

  // Test connection
  try {
    const { data, error } = await supabase
      .from("visitors")
      .select("count")
      .limit(1);
    if (!error) {
      console.log("🔗 Supabase connection successful!");
    } else {
      console.log("⚠️  Connection test failed, but credentials appear valid");
    }
  } catch (err) {
    console.log("⚠️  Could not test connection, but credentials appear valid");
  }
}

// Run the initialization
initializeDatabase();
