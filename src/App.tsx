import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import { BookingFlowPage } from "./pages/booking/BookingFlowPage";
import StaffDashboardPage from "./pages/staff/StaffDashboardPage";
import AdminPanelPage from "./pages/admin/AdminPanelPage";

const SESSION_KEY = "barber-flow-session";

const App = () => {
  const [hasSession, setHasSession] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      setHasSession(true);
      try {
        const parsed = JSON.parse(raw) as { role?: string };
        setIsAdmin(parsed.role === "admin");
        setIsStaff(parsed.role === "staff" || parsed.role === "admin");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!hasSession) {
    return (
      <LoginPage
        onLogin={() => {
          setHasSession(true);
          const raw = localStorage.getItem(SESSION_KEY);
          if (raw) {
            try {
              const parsed = JSON.parse(raw) as { role?: string };
              setIsAdmin(parsed.role === "admin");
              setIsStaff(parsed.role === "staff" || parsed.role === "admin");
            } catch (e) {
              console.error(e);
            }
          }
        }}
      />
    );
  }

  if (isAdmin) {
    return <AdminPanelPage />;
  }

  if (isStaff) {
    return <StaffDashboardPage />;
  }

  return <BookingFlowPage />;
};

export default App;
