import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

  try {
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const resetLink = `${process.env.APP_URL}/reset-password/${token}`;
    await sendEmail(
      user.email,
      "Reset Your Password",
      "Click the button below to reset your password", 
      `
        <html>
          <body>
            <p>Click the button below to reset your password:</p>
            <button style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; text-align: center;">
            <a href="${resetLink}">Reset Password</a>
            </button>
          </body>
        </html>
      `
    );

    return NextResponse.json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error creating password reset token:", error);
    return NextResponse.json(
      { error: "Failed to create password reset token" },
      { status: 500 }
    );
  }
}
