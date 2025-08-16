import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import UseAuthHook from "../../../hooks/contexthooks/UseAuthHook";
import Loader from "../../../components/Loader/Loader";
import axios from "axios";

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = UseAuthHook();
  const [role, setRole] = useState(null);
  const [fetchingRole, setFetchingRole] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

useEffect(() => {
  const fetchUsers = async () => {
    if (!user?.email) {
      setFetchingRole(false);
      return;
    }
    try {
      const res = await axios.get("https://code-circle-server-three.vercel.app/users");
      const allUsers = res.data;

      // find logged in user by email
      const currentUser = allUsers.find(u => u.email === user.email);

      // Force special email as admin always
      if (user.email === "admin@code-circle.com") {
        setRole("admin");
      } else {
        setRole(currentUser?.role || "user");
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setRole("user");
    } finally {
      setFetchingRole(false);
    }
  };

  fetchUsers();
}, [user]);


  useEffect(() => {
    if (user && !fetchingRole && role !== "admin") {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, role, fetchingRole, navigate]);

  if (loading || fetchingRole) return <Loader />;

  if (user && role === "admin") {
    return children;
  }

  if (user && role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h2 className="text-2xl text-red-600 font-semibold mb-2">Sorry! 🚫</h2>
          <p className="text-gray-600">You do not have permission to access the admin dashboard.</p>
          <p className="text-gray-400 text-sm mt-1">Redirecting you back...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminProtectedRoute;
