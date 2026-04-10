import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // ✅ GET TOKEN FROM URL
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!newPassword.trim()) {
      alert("Enter new password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Password updated successfully ✅");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="mb-4 text-xl">Reset Password</h2>

      <input
        type="password"
        placeholder="Enter new password"
        className="border p-2 mb-3 text-black"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        onClick={handleReset}
        className="bg-zinc-700 text-white px-4 py-2 rounded"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
