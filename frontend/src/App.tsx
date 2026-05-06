import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Chat from "./pages/Chat";
import CallLogs from "./pages/CallLogs";
import Analytics from "./pages/Analytics";
import AppLayout from "./layouts/AppLayout";
import ScheduledCalls from "./pages/ScheduledCalls";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH ROUTES (NO SIDEBAR) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* APP ROUTES (WITH SIDEBAR LAYOUT) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/chat/:agentId" element={<Chat />} />
          <Route path="/calls" element={<CallLogs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/scheduled-calls" element={<ScheduledCalls />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}