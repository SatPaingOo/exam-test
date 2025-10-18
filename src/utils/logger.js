import { supabase } from "src/services/supabase.js";
import { getUuid } from "src/services/localStorage.js";

export const getLogs = async () => {
  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .order("occurred_at", { ascending: false })
    .limit(100);
  if (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
  return data || [];
};

const getCurrentMeta = () => {
  return {
    visitor_uuid: getUuid(),
    page: window.location.pathname,
  };
};

export const logError = async (message, details = {}, meta = {}) => {
  const defaultMeta = getCurrentMeta();
  // If caller didn't provide an explicit action, log a developer warning so
  // missing metadata can be fixed at the call site. We still default to
  // 'unknown' to satisfy the DB not-null constraint.
  if (!meta.action) {
    // Use console.warn so it's visible during development but non-fatal.
    // Include the message to help track where it originated.
    console.warn(`[logger] Missing 'action' for error log: ${message}`);
  }
  const actionValue = meta.action || "unknown";
  const logEntry = {
    occurred_at: new Date().toISOString(),
    actor_type: meta.actor_type || "visitor",
    actor_id: meta.actor_id || null,
    user_id: meta.user_id || null,
    visitor_uuid: meta.visitor_uuid || defaultMeta.visitor_uuid,
    type: "error",
    // DB requires a non-null action; use computed value (and may be 'unknown')
    action: actionValue,
    page: defaultMeta.page,
    message,
    details,
    metadata: meta.metadata || null,
  };
  console.error(`[ERROR] ${message}`, details);
  // Debug: show payload being sent
  try {
    if (!supabase) {
      console.error("Supabase client not configured. Skipping log insert.", {
        logEntry,
      });
      return;
    }
    // Log the payload so we can inspect what is sent to Supabase
    console.debug("[logger] Sending error log to Supabase:", logEntry);
    const { error } = await supabase.from("logs").insert([logEntry]);
    if (error) {
      console.error("Error saving error log:", error, { logEntry });
    }
  } catch (ex) {
    console.error("Exception while saving error log:", ex, { logEntry });
  }
};

export const logSuccess = async (message, details = {}, meta = {}) => {
  const defaultMeta = getCurrentMeta();
  // Warn when callers omit action so maintainers can add meaningful actions.
  if (!meta.action) {
    console.warn(`[logger] Missing 'action' for success log: ${message}`);
  }
  const actionValue = meta.action || "unknown";
  const logEntry = {
    occurred_at: new Date().toISOString(),
    actor_type: meta.actor_type || "visitor",
    actor_id: meta.actor_id || null,
    user_id: meta.user_id || null,
    visitor_uuid: meta.visitor_uuid || defaultMeta.visitor_uuid,
    type: "success",
    // DB requires a non-null action; use computed value (and may be 'unknown')
    action: actionValue,
    page: defaultMeta.page,
    message,
    details,
    metadata: meta.metadata || null,
  };
  console.log(`[SUCCESS] ${message}`, details);
  try {
    if (!supabase) {
      console.error("Supabase client not configured. Skipping log insert.", {
        logEntry,
      });
      return;
    }
    console.debug("[logger] Sending success log to Supabase:", logEntry);
    const { error } = await supabase.from("logs").insert([logEntry]);
    if (error) {
      console.error("Error saving success log:", error, { logEntry });
    }
  } catch (ex) {
    console.error("Exception while saving success log:", ex, { logEntry });
  }
};

export const clearLogs = async () => {
  const { error } = await supabase.from("logs").delete().neq("id", 0); // delete all
  if (error) {
    console.error("Error clearing logs:", error);
  }
};

export const saveLogsToFile = async () => {
  if (!window.showSaveFilePicker) {
    alert("File System Access API not supported in this browser.");
    return;
  }
  try {
    const logs = await getLogs();
    const logData = JSON.stringify(logs, null, 2);
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: `logs-${new Date().toISOString().split("T")[0]}.json`,
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    const writable = await fileHandle.createWritable();
    await writable.write(logData);
    await writable.close();
    console.log("Logs saved to file", { fileName: fileHandle.name });
  } catch (error) {
    console.error("Failed to save logs to file", { error: error.message });
  }
};
