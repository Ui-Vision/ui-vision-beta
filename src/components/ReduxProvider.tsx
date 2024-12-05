"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { setUser, clearUser, setLoading } from "@/store/features/userSlice";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <Provider store={store}>
      <UserInitializer />
      {children}
    </Provider>
  );
};

const UserInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      try {
        dispatch(setLoading(true));
        const res = await fetch("/api/user", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();

        if (data.user) {
          dispatch(
            setUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              image: data.user.image,
              emailVerified: data.user.emailVerified,
            })
          );
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        dispatch(clearUser());
        dispatch(setLoading(false));
      } finally {
        dispatch(setLoading(false));
      }
    }

    fetchUser();
  }, [dispatch]);

  return null;
};
