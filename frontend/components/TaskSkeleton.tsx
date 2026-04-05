export function TaskSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card p-5 space-y-3"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-md shimmer-bg flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded-lg shimmer-bg" style={{ width: `${60 + (i % 3) * 15}%` }} />
              <div className="h-3 rounded-lg shimmer-bg" style={{ width: `${40 + (i % 4) * 10}%` }} />
            </div>
          </div>
          <div className="h-3 rounded shimmer-bg w-3/4" />
          <div className="h-3 rounded shimmer-bg w-1/2" />
          <div className="flex items-center justify-between pt-1">
            <div className="h-5 w-20 rounded-full shimmer-bg" />
            <div className="h-4 w-24 rounded shimmer-bg" />
          </div>
        </div>
      ))}
    </div>
  );
}
