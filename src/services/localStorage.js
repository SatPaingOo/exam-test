const base = "exam-test-";
const _token = base + "token";
const _uuid = base + "uuid";

export const setToken = (token) => {
  localStorage.setItem(_token, token);
};
export const getToken = () => {
  return localStorage.getItem(_token);
};
export const removeToken = () => {
  localStorage.removeItem(_token);
};

export const setUuid = (uuid) => {
  localStorage.setItem(_uuid, uuid);
};
export const getUuid = () => {
  let uuid = localStorage.getItem(_uuid);
  if (!uuid) {
    // Create and persist a UUID for the visitor on first access
    try {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        uuid = crypto.randomUUID();
      } else {
        // Fallback generator when crypto.randomUUID isn't available
        uuid = `v-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 9)}`;
      }
      localStorage.setItem(_uuid, uuid);
    } catch (e) {
      // As a last resort, return null but do not throw in client code
      console.error("Failed to create visitor UUID:", e);
      return null;
    }
  }
  return uuid;
};
export const removeUuid = () => {
  localStorage.removeItem(_uuid);
};

export const removeAll = () => {
  removeToken();
  // Keep UUID persistent
};
