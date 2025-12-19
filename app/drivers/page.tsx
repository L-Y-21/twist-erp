import { ErpLayout } from "@/components/erp-layout"
import { Card } from "@/components/ui/card"
import { navigationConfig } from "@/lib/navigation"

export default function DriversPage() {
  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Drivers</h1>
          <p className="text-muted-foreground">Manage driver information and licenses</p>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground">Driver management interface coming soon...</p>
        </Card>
      </div>
    </ErpLayout>
  )
}
