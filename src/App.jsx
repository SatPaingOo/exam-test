import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useLocation,
} from "react-router-dom";
import Layout from "src/components/layout/layout";
import routes from "src/routes/routes.jsx";
import "src/scss/main.scss";
import { supabase } from "src/services/supabase";
import { getUuid, setUuid } from "src/services/localStorage";
import { logError, logSuccess } from "src/utils/logger";
import { AuthProvider } from "src/context/AuthContext";

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    // Log page view on route change. Guard against React StrictMode double-invocation
    try {
      const last = sessionStorage.getItem("lastPageView");
      const now = Date.now();
      const payload = { path: location.pathname, at: now };
      let doLog = true;
      if (last) {
        try {
          const lastObj = JSON.parse(last);
          // If same path and last logged less than 2s ago, skip to avoid double logging in StrictMode
          if (
            lastObj.path === location.pathname &&
            now - (lastObj.at || 0) < 2000
          )
            doLog = false;
        } catch (e) {
          // fall through and log
        }
      }
      if (doLog) {
        logSuccess("Page viewed", {}, { action: "page_view" });
        sessionStorage.setItem("lastPageView", JSON.stringify(payload));
      }
    } catch (e) {
      // If sessionStorage fails, still attempt to log once
      logSuccess("Page viewed", {}, { action: "page_view" });
    }
  }, [location.pathname]);

  return useRoutes(routes);
}

function App() {
  useEffect(() => {
    const initializeUuid = async () => {
      try {
        // Ensure we have a persistent visitor UUID (getUuid will create/persist on first access)
        let uuid = getUuid();
        if (!uuid) {
          // Fallback: generate a UUID and persist
          uuid =
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `v-${Date.now().toString(36)}-${Math.random()
                  .toString(36)
                  .slice(2, 9)}`;
          setUuid(uuid);
        }

        // Ensure a visitors row exists for this uuid. If not, insert it.
        try {
          const { data: existing, error: selectError } = await supabase
            .from("visitors")
            .select("id")
            .eq("uuid", uuid)
            .limit(1);
          if (selectError) {
            logError("Error checking visitor in DB", {
              error: selectError.message,
              uuid,
            });
          } else if (!existing || existing.length === 0) {
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

            const { error: insertError } = await supabase
              .from("visitors")
              .insert([{ uuid, device_type: deviceType }]);
            if (insertError) {
              logError("Error saving UUID to DB", {
                error: insertError.message,
                uuid,
              });
            } else {
              logSuccess("UUID saved to DB successfully", { uuid });
            }
          }
        } catch (dbErr) {
          logError("Unexpected error ensuring visitor row", {
            error: dbErr.message,
            uuid,
          });
        }
      } catch (e) {
        console.error("Error initializing visitor UUID:", e);
      }
    };
    initializeUuid();
  }, []);

  return (
    <AuthProvider>
      <Router basename="/exam-test">
        <Layout>
          <Suspense
            fallback={
              <div className="loading-screen">
                <div className="container">
                  <div className="loading-spinner"></div>
                  <p>Loading...</p>
                </div>
              </div>
            }
          >
            <AppRoutes />
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
