import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/Calendar";
import Courses from "./pages/Courses";
import Settings from "./pages/Settings";
import AppLayout from "./layouts/AppLayout";
import AuthInterceptor from "./components/AuthInterceptor";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NotificationProvider>
          <AuthInterceptor />
          <Routes>
            <Route path="/" element={<Landing />} />

            {/* Protected App Routes */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="courses" element={<Courses />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Legacy Redirects */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/calendar" element={<Navigate to="/app/calendar" replace />} />
          </Routes>
          <Analytics />
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
