import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ DEV: show token
      alert("Reset token is sent to your email !");

      // ✅ Redirect to reset page
      navigate("/reset-password");
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col items-center w-80">
        <h2 className="mb-4 text-xl font-semibold">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-zinc-600 p-2 mb-4 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleForgot}
          disabled={loading}
          className="w-full bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Token"}
        </button>

        {/* ✅ Optional manual navigation */}
        <p
          className="mt-4 text-sm text-zinc-400 cursor-pointer hover:text-white"
          onClick={() => navigate("/reset-password")}
        >
          Already have token? Reset Password
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
