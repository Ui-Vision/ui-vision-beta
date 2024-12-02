import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

const secretKey = process.env.SESSION_SECRET || "your-secret-key";
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string): Promise<Response> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const token = await encrypt({ userId, expiresAt });

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  // Set the cookie in the response
  const response = NextResponse.json({ message: "Session created" });
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return response;
}

export async function encrypt(payload: { userId: string; expiresAt: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt.getTime() / 1000) // Use Unix timestamp
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    const session = await prisma.session.findUnique({ where: { token } });

    if (!session || new Date(session.expiresAt) < new Date()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}