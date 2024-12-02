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

    const sessionResponse = await createSession(user.id);

    return sessionResponse; 
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "Internal server error", details: "Unknown error" },
        { status: 500 }
      );
    }
  }
}