"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearUser } from "@/store/features/userSlice";


export default function Navbar() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(!!user?.id);
  useEffect(() => {
    setIsLoggedIn(!!user?.id);
  }, [user]);

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }
      dispatch(clearUser());
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <nav className="bg-gray-900 text-white border-b-[0.7px] border-neutral-300 p-4 flex justify-between w-full items-center">
      <div className="text-lg font-bold">Ui Vision</div>
      <div>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <span>{user?.name || user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
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
