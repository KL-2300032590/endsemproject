import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Components/Home";
import Events from "../Components/Events";
import Login from "../Components/Login";
import Register from "../Components/Register";
import Team from "../Components/Team";
import ProtectedRoute from "../utils/ProtectedRoute";
import PaymentPage from "../Components/PaymentPage";
import AdminPanel from "../Components/AdminPanel";
import RegisteredEvents from "../Components/RegisteredEvents";
import AuthRoute from "../utils/AuthRoute";
import { getUser } from "../utils/auth";
import PleaseLogin from "../Components/PleaseLogin";
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const NRoutes = () => {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/team" element={<Team />} />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/registered-events"
        element={
          <ProtectedRoute>
            <RegisteredEvents />
          </ProtectedRoute>
        }
      />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/please-login" element={<PleaseLogin />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default NRoutes;
