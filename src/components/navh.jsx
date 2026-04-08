import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavH = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      navigate("/login"); // ✅ SPA navigation
    } catch (err) {
      console.error(err.message);
      alert("Something went wrong during logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-zinc-500 text-white">
      {/* Left Side */}
      <h1 className="text-2xl font-bold italic text-zinc-900 font-sans">Task Manager</h1>

      {/* Right Side */}
      <button
        className="bg-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-600 disabled:opacity-50"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </nav>
  );
};

export default NavH;
