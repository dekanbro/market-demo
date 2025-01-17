import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-8 w-24" />
      <div className="bg-card shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <Skeleton className="h-64 md:h-[400px] md:w-1/2" />
          <div className="md:w-1/2 p-6 md:p-8 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-24" />
            <div className="flex space-x-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 