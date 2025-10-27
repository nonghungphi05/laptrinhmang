import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  let data: any;
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await request.json();
  } else {
    const form = await request.formData();
    data = Object.fromEntries(form.entries());
  }
  const { carId, userId, guestName, guestEmail, startAt, endAt } = data;

  if (!carId || !startAt || !endAt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const start = new Date(startAt);
  const end = new Date(endAt);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  // Check overlapping bookings
  const overlap = await prisma.booking.findFirst({
    where: {
      carId,
      NOT: [
        { endAt: { lte: start } },
        { startAt: { gte: end } },
      ],
    },
  });
  if (overlap) {
    return NextResponse.json({ error: "Car already booked for selected dates" }, { status: 409 });
  }

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = days * car.pricePerDay;

  const booking = await prisma.booking.create({
    data: {
      carId,
      userId,
      guestName,
      guestEmail,
      startAt: start,
      endAt: end,
      totalPrice,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
