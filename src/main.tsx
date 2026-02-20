import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { TimerProvider } from "./contexts/TimerContext";
import { DailyScheduleProvider } from "./contexts/DailyScheduleContext";

createRoot(document.getElementById("root")!).render(
    <TimerProvider>
        <DailyScheduleProvider>
            <App />
        </DailyScheduleProvider>
    </TimerProvider>
);
