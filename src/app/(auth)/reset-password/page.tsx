"use client";

import { useState } from "react";

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true)
        setError("");
      } else {
        setError(data.error || "An error occurred");
      }
    } catch {
      setError("Failed to send request. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      {success ? (
        <p className="text-green-500">
          A password reset link has been sent to your email. Please check your
          inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="bg-transparent text-white border-[0.6px] border-neutral-400 p-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
}
