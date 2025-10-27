import Image from "next/image";

export interface CarCardProps {
  id: string;
  title: string;
  brand: string;
  model: string;
  city: string;
  pricePerDay: number;
  rating?: number | null;
  tripsCount: number;
  imageUrl?: string;
}

export function CarCard(props: CarCardProps) {
  const { id, title, brand, model, city, pricePerDay, rating, tripsCount, imageUrl } = props;
  return (
    <a href={`/car/${id}`} className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-44 w-full bg-zinc-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-zinc-400">No image</div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <div className="text-sm text-zinc-500">{city}</div>
        <div className="line-clamp-1 text-base font-semibold">{title}</div>
        <div className="text-sm text-zinc-600">{brand} • {model}</div>
        <div className="mt-1 flex items-center justify-between">
          <div className="text-lg font-semibold">{pricePerDay.toLocaleString()}đ<span className="text-sm font-normal">/ngày</span></div>
          <div className="text-sm text-zinc-600">⭐ {rating ?? 4.8} • {tripsCount} chuyến</div>
        </div>
      </div>
    </a>
  );
}
