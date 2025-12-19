import { ErpLayout } from "@/components/erp-layout"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { navigationConfig } from "@/lib/navigation"

export default function PayrollLoading() {
  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-20" />
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <Skeleton className="h-96" />
        </Card>
      </div>
    </ErpLayout>
  )
}
