import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, value } = await req.json();

    if (!name || !value) {
      return NextResponse.json({ error: 'Name and value are required' }, { status: 400 });
    }
    const filterTag = await prisma.filterTag.create({
      data: {
        name,
        value,
      },
    });

    return NextResponse.json({ filterTag }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


export async function GET() {
  try {
    const filterTags = await prisma.filterTag.findMany({ select: { name: true, value: true , id: true } });

    return NextResponse.json({ filterTags });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}