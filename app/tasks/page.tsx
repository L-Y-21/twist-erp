import { ErpLayout } from "@/components/erp-layout"
import { Card } from "@/components/ui/card"
import { navigationConfig } from "@/lib/navigation"

export default function TasksPage() {
  return (
    <ErpLayout navigation={navigationConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Tasks</h1>
          <p className="text-muted-foreground">Manage project tasks and assignments</p>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground">Task management interface coming soon...</p>
        </Card>
      </div>
    </ErpLayout>
  )
}
