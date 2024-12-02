"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between w-full items-center">
      <div className="text-lg font-bold">My App</div>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span>{user.name || user.email}</span>
          </div>
        ) : (
          <div className="flex space-x-4">
            <a href="/login" className="text-blue-400 hover:underline">
              Login
            </a>
            <a href="/register" className="text-green-400 hover:underline">
              Register
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}