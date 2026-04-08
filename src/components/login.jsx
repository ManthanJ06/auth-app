import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      e.target.reset();
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center mt-10">
      <h1 className="text-2xl font-bold">Login Page</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="p-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="p-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-md bg-green-600 hover:bg-green-800 text-white font-bold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* ✅ Error Message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
