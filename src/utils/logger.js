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
  const logEntry = {
    occurred_at: new Date().toISOString(),
    actor_type: meta.actor_type || "visitor",
    actor_id: meta.actor_id || null,
    user_id: meta.user_id || null,
    visitor_uuid: defaultMeta.visitor_uuid,
    type: "error",
    action: meta.action || null,
    page: defaultMeta.page,
    message,
    details,
    metadata: meta.metadata || null,
  };
  console.error(`[ERROR] ${message}`, details);
  const { error } = await supabase.from("logs").insert([logEntry]);
  if (error) {
    console.error("Error saving error log:", error);
  }
};

export const logSuccess = async (message, details = {}, meta = {}) => {
  const defaultMeta = getCurrentMeta();
  const logEntry = {
    occurred_at: new Date().toISOString(),
    actor_type: meta.actor_type || "visitor",
    actor_id: meta.actor_id || null,
    user_id: meta.user_id || null,
    visitor_uuid: defaultMeta.visitor_uuid,
    type: "success",
    action: meta.action || null,
    page: defaultMeta.page,
    message,
    details,
    metadata: meta.metadata || null,
  };
  console.log(`[SUCCESS] ${message}`, details);
  const { error } = await supabase.from("logs").insert([logEntry]);
  if (error) {
    console.error("Error saving success log:", error);
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
