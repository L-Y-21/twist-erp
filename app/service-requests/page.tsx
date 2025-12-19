import { ErpLayout } from "@/components/erp-layout"
import { Card } from "@/components/ui/card"
import { navigationConfig } from "@/lib/navigation"

export default function ServiceRequestsPage() {
  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Service Requests</h1>
          <p className="text-muted-foreground">Track and manage service requests</p>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground">Service requests interface coming soon...</p>
        </Card>
      </div>
    </ErpLayout>
  )
}
