import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.carImage.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  const owner = await prisma.user.create({
    data: { email: "host@example.com", name: "Host", phone: "0900000000" },
  });

  const inputs = [
    {
      title: "Toyota Vios 2022 - Sạch đẹp",
      brand: "Toyota",
      model: "Vios",
      year: 2022,
      city: "Hồ Chí Minh",
      pricePerDay: 700000,
      seats: 5,
      transmission: "AT",
      fuel: "Gasoline",
      description: "Xe sạch sẽ, tiết kiệm, giao nhận linh hoạt.",
      features: { bluetooth: true, gps: true, camera: true },
      images: [
        "https://images.unsplash.com/photo-1605557614660-7f9b55f6b531",
        "https://images.unsplash.com/photo-1517673400267-0251440c45dc",
      ],
    },
    {
      title: "VinFast VF8 - SUV điện sang trọng",
      brand: "VinFast",
      model: "VF8",
      year: 2024,
      city: "Hà Nội",
      pricePerDay: 1800000,
      seats: 5,
      transmission: "AT",
      fuel: "EV",
      description: "SUV điện hiện đại, nhiều tính năng an toàn.",
      features: { adas: true, autopilot: false },
      images: [
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
        "https://images.unsplash.com/photo-1549921296-3ecf9e32754f",
      ],
    },
    {
      title: "Mazda 3 2021 - Đỏ cá tính",
      brand: "Mazda",
      model: "3",
      year: 2021,
      city: "Đà Nẵng",
      pricePerDay: 900000,
      seats: 5,
      transmission: "AT",
      fuel: "Gasoline",
      description: "Thiết kế đẹp, cảm giác lái tốt.",
      features: { sunroof: true },
      images: [
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
        "https://images.unsplash.com/photo-1544546303-2561b5e88432",
      ],
    },
  ];

  const createdCars = [] as { id: string }[];
  for (const c of inputs) {
    const car = await prisma.car.create({
      data: {
        title: c.title,
        brand: c.brand,
        model: c.model,
        year: c.year,
        city: c.city,
        pricePerDay: c.pricePerDay,
        seats: c.seats,
        transmission: c.transmission,
        fuel: c.fuel,
        description: c.description,
        features: c.features as any,
        ownerId: owner.id,
      },
    });
    for (const [idx, url] of c.images.entries()) {
      await prisma.carImage.create({ data: { carId: car.id, url, order: idx } });
    }
    createdCars.push(car);
  }

  console.log(`Seeded ${createdCars.length} cars`);
}

main().finally(async () => {
  await prisma.$disconnect();
});
