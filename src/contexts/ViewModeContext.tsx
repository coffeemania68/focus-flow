import { createContext, useContext, useState, ReactNode } from "react";

export type ViewMode = "small" | "medium" | "large";

interface ViewModeContextType {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType>({
  mode: "medium",
  setMode: () => {},
});

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>(() => {
    return (localStorage.getItem("view-mode") as ViewMode) || "medium";
  });

  const handleSetMode = (m: ViewMode) => {
    setMode(m);
    localStorage.setItem("view-mode", m);
  };

  return (
    <ViewModeContext.Provider value={{ mode, setMode: handleSetMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export const useViewMode = () => useContext(ViewModeContext);
