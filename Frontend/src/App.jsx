import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Components/Navbar";
import NRoutes from "./Routes/NRoutes";
import Footer from "./Components/Footer";
import { useLenis } from "./hooks/useLenis";
import Loading from "./Components/Loading";
import CursorFollower from "./Components/CursorFollower";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from './context/AuthContext';

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useLenis();

  return (
    <AuthProvider>
      <MotionConfig reducedMotion="user">
        <div className="relative">
          {loading ? (
            <Loading />
          ) : (
            <div className="flex">
              <Sidebar />
              <main className="flex-1">
                <NRoutes />
                <Footer />
              </main>
            </div>
          )}
        </div>
      </MotionConfig>
    </AuthProvider>
  );
};

export default App;
