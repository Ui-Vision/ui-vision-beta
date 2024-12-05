import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, description, userId, categoryIds, filterTagIds } = body;

    if (!name || !price || !userId || !categoryIds || categoryIds.length === 0) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        userId,
        categories: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
        filterTags: {
          connect: filterTagIds?.map((id: string) => ({ id })) || [],
        },
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}