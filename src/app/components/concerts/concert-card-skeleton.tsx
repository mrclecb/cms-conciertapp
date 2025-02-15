import { Skeleton } from "@/components/ui/skeleton"

export function ConcertCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" /> {/* Título */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" /> {/* Fecha */}
          <Skeleton className="h-4 w-1/2" /> {/* Venue */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" /> {/* Artists */}
          <Skeleton className="h-4 w-1/3" /> {/* Artists */}
        </div>
      </div>
    </div>
  )
}