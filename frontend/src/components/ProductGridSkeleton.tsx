const skeletonCards = Array.from({ length: 4 }, (_, index) => index);

export default function ProductGridSkeleton() {
  return (
    <section className="py-20" id="products">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-3 h-4 w-36 animate-pulse rounded-full bg-stone-200" />
          <div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded-full bg-stone-200" />
          <div className="mx-auto h-4 w-full max-w-2xl animate-pulse rounded-full bg-stone-100" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skeletonCards.map((card) => (
            <div
              key={card}
              className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm"
            >
              <div className="aspect-[3/4] animate-pulse bg-stone-100" />
              <div className="space-y-4 p-6">
                <div className="h-6 w-3/4 animate-pulse rounded-full bg-stone-200" />
                <div className="h-4 w-1/2 animate-pulse rounded-full bg-stone-100" />
                <div className="flex items-center justify-between">
                  <div className="h-7 w-24 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-11 w-28 animate-pulse rounded-full bg-stone-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
