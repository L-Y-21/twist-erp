import { ErpLayout } from "@/components/erp-layout"
import { Card } from "@/components/ui/card"
import { navigationConfig } from "@/lib/navigation"

export default function PropertiesPage() {
  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Properties</h1>
          <p className="text-muted-foreground">Manage properties and real estate assets</p>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground">Properties management interface coming soon...</p>
        </Card>
      </div>
    </ErpLayout>
  )
}
