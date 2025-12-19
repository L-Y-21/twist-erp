import { ErpLayout } from "@/components/erp-layout"
import { Card } from "@/components/ui/card"
import { navigationConfig } from "@/lib/navigation"

export default function AuditLogsPage() {
  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Audit Logs</h1>
          <p className="text-muted-foreground">Track system activity and user actions</p>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground">Audit logs interface coming soon...</p>
        </Card>
      </div>
    </ErpLayout>
  )
}
