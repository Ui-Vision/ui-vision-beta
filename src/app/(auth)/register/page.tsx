"use client";

import { useState } from "react";
import { registerSchema } from "../schemas/authSchemas";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    const result = registerSchema.safeParse(data);

    if (!result.success) {
      setErrors({ error  : "wrong"});
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const { error } = await res.json();
      setErrors({ server: error });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      {errors.name && <p>{errors.name[0]}</p>}

      <input name="email" type="email" placeholder="Email" />
      {errors.email && <p>{errors.email[0]}</p>}

      <input name="password" type="password" placeholder="Password" />
      {errors.password && <p>{errors.password[0]}</p>}

      {errors.server && <p>{errors.server}</p>}

      <button type="submit">Register</button>
    </form>
  );
}