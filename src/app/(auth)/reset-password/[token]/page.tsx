"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function ResetPasswordPage() {
  const pathname = usePathname();
  const token = pathname?.split("/")[2];
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !token) {
      setError("Token and new password are required");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setError("");
        setPassword("");
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      {success ? (
        <p className="text-green-500">
          Your password has been successfully reset!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block font-medium">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-transparent text-white border-[0.6px] border-neutral-400 p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}
