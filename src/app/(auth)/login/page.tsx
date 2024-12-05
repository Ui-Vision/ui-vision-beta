"use client";

import { useState } from "react";
import { loginSchema } from "../schemas/authSchemas";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(formData.entries());

    const result = loginSchema.safeParse(formObject);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(result.data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ global: [data.error] });
        return;
      }

      router.push('/profile')
    } catch (error) {
      console.error(error);
      setErrors({ global: ["Something went wrong. Please try again."] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
      {errors.global && <p className="text-red-500">{errors.global[0]}</p>}
      <input
        name="email"
        placeholder="Email"
        className={`input bg-transparent text-white border-[0.6px] border-neutral-400 p-2 ${errors.email ? "border-red-500" : ""}`}
      />
      {errors.email && <p>{errors.email[0]}</p>}

      <input
        name="password"
        type="password"
        placeholder="Password"
        className={`input bg-transparent text-white border-[0.6px] border-neutral-400 p-2 ${errors.password ? "border-red-500" : ""}`}
      />
      {errors.password && <p>{errors.password[0]}</p>}

      <button type="submit" disabled={isLoading} className="bg-blue-600">
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}