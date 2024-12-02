import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create a session
    await createSession(user.id);

    return NextResponse.json({ message: "Login successful" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // now TypeScript knows that error has a message property
      console.error("Login error:", error.message);
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    } else {
      // In case error is not an instance of Error
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "Internal server error", details: "Unknown error" },
        { status: 500 }
      );
    }
  }
}