import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, verificationCode } = await req.json();

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { verificationCodes: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Find the verification code entry
    const verificationEntry = user.verificationCodes.find(
      (code) => code.code === verificationCode
    );

    if (!verificationEntry) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Check if the verification code has expired
    if (new Date() > new Date(verificationEntry.expiresAt)) {
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Mark email as verified and remove the verification code
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    await prisma.verificationCode.deleteMany({
      where: { userId: user.id },
    });

    // Create a session for the user
    const sessionResponse = await createSession(user.id);

    return sessionResponse; // Return session response directly
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Verification error:", error.message);
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