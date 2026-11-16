import { Skeleton } from "@/components/shared/ui/skeleton";

// ── Table page skeleton (list rows) ──────────────────────────────────────────
export function TablePageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      {/* Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 flex gap-4">
          {[40, 25, 20, 15].map((w, i) => (
            <Skeleton key={i} className={`h-4 w-[${w}%]`} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-3.5 flex gap-4 border-t border-slate-100"
          >
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[25%]" />
            <Skeleton className="h-4 w-[20%]" />
            <Skeleton className="h-4 w-[10%] ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Detail page skeleton (two-column) ────────────────────────────────────────
export function DetailPageSkeleton() {
  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + heading */}
      <Skeleton className="h-5 w-28" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-slate-200 rounded-xl overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="px-5 py-4 border-r border-slate-100 last:border-r-0 space-y-2"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}

// ── Card grid skeleton (products, banks, etc.) ───────────────────────────────
export function CardGridSkeleton({
  cols = 3,
  cards = 6,
}: {
  cols?: number;
  cards?: number;
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-4`}
    >
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="border border-slate-200 rounded-xl p-5 space-y-3"
        >
          <Skeleton className="h-14 w-28" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

// ── Dashboard home skeleton ───────────────────────────────────────────────────
export function DashboardHomeSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border border-slate-200 rounded-xl p-5 space-y-2"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

// ── Profile page skeleton ─────────────────────────────────────────────────────
export function ProfilePageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-slate-200 rounded-xl p-4 space-y-2"
          >
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
      <div className="border border-slate-200 rounded-xl p-4 space-y-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 border-t border-slate-100"
          >
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Product detail page skeleton ──────────────────────────────────────────────
export function ProductDetailPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
      <Skeleton className="h-80 rounded-2xl" />
      <div className="space-y-5">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-11 rounded-lg" />
      </div>
    </div>
  );
}
