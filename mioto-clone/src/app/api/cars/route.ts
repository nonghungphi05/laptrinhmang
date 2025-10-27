import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const where: any = {};
  if (city) where.city = city;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
    ];
  }
  if (minPrice || maxPrice) {
    where.pricePerDay = {};
    if (minPrice) where.pricePerDay.gte = Number(minPrice);
    if (maxPrice) where.pricePerDay.lte = Number(maxPrice);
  }

  const cars = await prisma.car.findMany({
    where,
    include: { images: true, owner: true },
    orderBy: { rating: "desc" },
    take: 30,
  });

  return NextResponse.json(cars);
}
