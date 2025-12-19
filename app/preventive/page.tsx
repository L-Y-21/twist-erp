import { ErpLayout } from "@/components/erp-layout"
import { Card } from "@/components/ui/card"
import { navigationConfig } from "@/lib/navigation"

export default function PreventiveMaintenancePage() {
  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Preventive Maintenance</h1>
          <p className="text-muted-foreground">Schedule and track preventive maintenance</p>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground">Preventive maintenance interface coming soon...</p>
        </Card>
      </div>
    </ErpLayout>
  )
}
