import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import { BookingFlowPage } from "./pages/booking/BookingFlowPage";

const SESSION_KEY = "barber-flow-session";

const App = () => {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    setHasSession(!!raw);
  }, []);

  if (!hasSession) {
    return <LoginPage onLogin={() => setHasSession(true)} />;
  }

  return <BookingFlowPage />;
};

export default App;
