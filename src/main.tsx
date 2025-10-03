import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedDemoData } from "@/lib/demoSeed";

// Seed demo data for mock client (no backend)
seedDemoData();

createRoot(document.getElementById("root")!).render(<App />);
