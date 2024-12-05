import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/sendEmail";
import jalaali from "jalaali-js";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json(
      { error: "Token and new password are required" },
      { status: 400 }
    );
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });
  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

  const user = resetToken.user;
  const currentDate = new Date();
  const persianDate = jalaali.toJalaali(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
  const formattedPersianDate = `${persianDate.jy}/${persianDate.jm}/${persianDate.jd}`;

  const emailBody = `
    <p>سلام ${user.name},</p>
    <p>رمز عبور شما با موفقیت تغییر یافت. تاریخ تغییر رمز عبور: ${formattedPersianDate}</p>
    <p>اگر این تغییر توسط شما انجام نشده است، لطفاً با تیم پشتیبانی تماس بگیرید.</p>
    <p>با تشکر،</p>
    <p>تیم پشتیبانی</p>
  `;

  await sendEmail(
    user.email,
    "تغییر موفقیت آمیز رمز عبور",
    "رمز عبور شما با موفقیت تغییر یافت",
    emailBody
  );

  return NextResponse.json({ message: "Password reset successfully" });
}