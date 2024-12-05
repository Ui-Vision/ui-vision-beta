import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  // Update with the correct path to your Prisma client instance

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        username: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}