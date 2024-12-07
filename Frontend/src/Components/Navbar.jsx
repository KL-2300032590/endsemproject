import React, { useState, useRef, useEffect } from "react";
import { navLinks, adminNavLink } from "../Constants/Constants";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUser, removeToken, removeUser } from "../utils/auth";
import { useAuth } from '../context/AuthContext';
import logo from "../assets/surabhi.png";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(getUser());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const isAdmin = authUser?.role === "admin";
  const isAuthenticated = !!authUser;

  const navigationLinks = [...navLinks];
  if (isAdmin) {
    navigationLinks.push(adminNavLink);
  }

  // Storage event listener
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUser());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    removeToken();
    removeUser();
    setUser(null);
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-black/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <img src={logo} alt="logo" className="w-10 h-12" />
              <h1 className="text-xl font-bold text-white">VIRTUAL EVENT</h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-6">
            <div className="space-y-4">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.title}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:bg-purple-600/20 hover:text-white"
                    }`
                  }
                >
                  {link.title}
                </NavLink>
              ))}
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="text-white hover:text-purple-400 transition-colors duration-200"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </nav>

          {/* User Profile/Auth Section */}
          <div className="p-6 border-t border-white/10">
            {authUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    {authUser?.fullName?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-white font-medium">{authUser?.fullName}</p>
                    <p className="text-sm text-gray-400">{authUser?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-purple-600 text-white py-2 rounded-lg text-center hover:bg-purple-700 transition-all duration-300"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full border border-purple-600 text-purple-600 py-2 rounded-lg text-center hover:bg-purple-600 hover:text-white transition-all duration-300"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
