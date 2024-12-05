import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies(); 
    const sessionToken = await cookieStore.get('session')?.value; 

    if (!sessionToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = await decrypt(sessionToken);

    if (!session || typeof session.userId !== 'string') {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 });
    }
    const body = await req.json();
    const { name, slug, subTitle, status = 'ACTIVE', filterTags } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        subTitle,
        status,
        filterTags: {
          create: filterTags?.map((tag: { name: string; value: string }) => ({
            name: tag.name,
            value: tag.value,
          })) || [],
        },
      },
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ select: { id: true, name: true } });

    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}