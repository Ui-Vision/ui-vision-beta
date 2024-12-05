import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filterTagIds = searchParams.getAll("filterTagIds");

  try {
    const products = await prisma.product.findMany({
      where: {
        filterTags: {
          some: {
            id: {
              in: filterTagIds, // محصولات با هر یک از این تگ‌ها
            },
          },
        },
      },
      include: {
        filterTags: true, // برگرداندن تگ‌ها همراه محصول
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" });
  }
}