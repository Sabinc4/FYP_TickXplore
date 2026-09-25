/** Loading skeleton that mirrors the structure of `AccommodationCard`. */
const SkeletonCard = () => (
  <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
    <div className="aspect-[4/3] w-full animate-pulse bg-slate-200" />
    <div className="flex flex-1 flex-col space-y-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-14 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
      <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
      <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-100" />
      <div className="flex gap-1.5 pt-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-blue-50" />
        ))}
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="space-y-2">
          <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;