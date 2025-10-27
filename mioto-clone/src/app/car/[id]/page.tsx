import Image from "next/image";
import { prisma } from "@/lib/prisma";

interface Params { params: { id: string } }

export default async function CarDetail({ params }: Params) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: { images: true, owner: true },
  });
  if (!car) return <div className="p-6">Không tìm thấy xe</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-2">
            {car.images.map((img) => (
              <div key={img.id} className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-100">
                <Image src={img.url} alt={car.title} fill className="object-cover" />
              </div>
            ))}
          </div>
          <h1 className="mt-4 text-2xl font-semibold">{car.title}</h1>
          <div className="text-zinc-600">{car.brand} • {car.model} • {car.year}</div>
          <p className="mt-3 whitespace-pre-wrap text-zinc-700">{car.description}</p>
          <div className="mt-3 text-sm text-zinc-600">Chủ xe: {car.owner?.name ?? "Host"} ({car.owner?.phone})</div>
        </div>
        <div className="lg:col-span-1">
          <form className="sticky top-4 rounded-xl border p-4 shadow-sm" action="/api/bookings" method="post">
            <div className="text-xl font-semibold">{car.pricePerDay.toLocaleString()}đ<span className="text-sm font-normal">/ngày</span></div>
            <input type="hidden" name="carId" value={car.id} />
            <div className="mt-3">
              <label className="text-sm text-zinc-600">Ngày nhận</label>
              <input name="startAt" type="date" className="mt-1 h-10 w-full rounded-md border px-3 text-sm" required />
            </div>
            <div className="mt-3">
              <label className="text-sm text-zinc-600">Ngày trả</label>
              <input name="endAt" type="date" className="mt-1 h-10 w-full rounded-md border px-3 text-sm" required />
            </div>
            <div className="mt-3">
              <label className="text-sm text-zinc-600">Họ tên</label>
              <input name="guestName" className="mt-1 h-10 w-full rounded-md border px-3 text-sm" />
            </div>
            <div className="mt-3">
              <label className="text-sm text-zinc-600">Email</label>
              <input name="guestEmail" type="email" className="mt-1 h-10 w-full rounded-md border px-3 text-sm" />
            </div>
            <button className="mt-4 h-10 w-full rounded-md bg-black text-white">Đặt xe</button>
          </form>
        </div>
      </div>
    </div>
  );
}
