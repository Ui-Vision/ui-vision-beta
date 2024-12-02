"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch user");

        const data: User = await res.json();
        setUser(data);
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
            {user.image && (
              <img
                src={user.image}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span>{user.name || user.email}</span>
          </div>
        ) : (
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        )}
      </div>
    </nav>
  );
}