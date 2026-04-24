import React, { useCallback } from "react";
import { createRoot } from "react-dom/client";
import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";
import { Dashboard } from "./Dashboard";
import { ConsultantProfile } from "../consultant-profile/ConsultantProfile";
import { useOpenAiGlobal } from "../hooks/useOpenAiGlobal";
import { useWidgetState } from "../hooks/useWidgetState";
import type { Theme, ConsultantProfileData } from "../types";

interface WidgetPersistedState {
  profileView: ConsultantProfileData | null;
}

function App() {
  const theme = (useOpenAiGlobal<string>("theme") ?? "light") as Theme;
  const [widgetState, setWidgetState] = useWidgetState<WidgetPersistedState>({ profileView: null });
  const profileView = widgetState.profileView;

  const setProfileView = useCallback(
    (data: ConsultantProfileData | null) => setWidgetState({ ...widgetState, profileView: data }),
    [widgetState, setWidgetState]
  );

  const handleBack = useCallback(() => setProfileView(null), [setProfileView]);

  return (
    <FluentProvider theme={theme === "dark" ? webDarkTheme : webLightTheme}>
      {profileView ? (
        <div>
          <div style={{ padding: "8px 16px 0" }}>
            <span
              onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setTimeout(handleBack, 0); }}
              style={{
                cursor: "pointer", fontSize: 13, fontWeight: 500,
                color: theme === "dark" ? "#60a5fa" : "#0a66c2",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}
            >
              ← Back to Dashboard
            </span>
          </div>
          <ConsultantProfile data={profileView} />
        </div>
      ) : (
        <Dashboard onShowProfile={setProfileView} />
      )}
    </FluentProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
