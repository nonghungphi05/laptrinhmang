import { CarCard } from "@/components/CarCard";

async function fetchCars(params?: { q?: string; city?: string }) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/cars`);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.city) url.searchParams.set("city", params.city);
  const res = await fetch(url.toString(), { cache: "no-store" });
  return res.json();
}

export default async function Home({ searchParams }: { searchParams?: { q?: string; city?: string } }) {
  const cars = await fetchCars({ q: searchParams?.q, city: searchParams?.city });
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <a href="/" className="text-xl font-bold text-zinc-900">Mioto Clone</a>
          <form action="/" className="ml-auto flex w-full max-w-xl items-center gap-2">
            <input name="q" placeholder="Tìm xe theo tên, hãng, mẫu..." className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300" />
            <button className="h-10 rounded-md bg-black px-4 text-sm text-white">Tìm kiếm</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Xe nổi bật</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((c: any) => (
            <CarCard
              key={c.id}
              id={c.id}
              title={c.title}
              brand={c.brand}
              model={c.model}
              city={c.city}
              pricePerDay={c.pricePerDay}
              rating={c.rating}
              tripsCount={c.tripsCount}
              imageUrl={c.images?.[0]?.url}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
