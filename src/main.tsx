import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { TimerProvider } from "./contexts/TimerContext";

createRoot(document.getElementById("root")!).render(
    <TimerProvider>
        <App />
    </TimerProvider>
);
