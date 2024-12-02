"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setEmail(data.email as string);
      setStep("verify");
    } else {
      const { error } = await res.json();
      setErrors({ server: error });
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const verificationCode = formData.get("code");

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email, verificationCode }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const { error } = await res.json();
      setErrors({ server: error });
    }
  }

  return step === "register" ? (
    <form onSubmit={handleRegister}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {errors.server && <p>{errors.server}</p>}
      <button type="submit">Register</button>
    </form>
  ) : (
    <form onSubmit={handleVerify}>
      <p>We have sent a verification code to your email.</p>
      <input name="code" placeholder="Verification Code" required className=" bg-transparent text-white" />
      {errors.server && <p>{errors.server}</p>}
      <button type="submit">Verify</button>
    </form>
  );
}