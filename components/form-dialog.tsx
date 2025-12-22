"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: React.ReactNode
    onSave?: () => void
    onCancel?: () => void
    isSaving?: boolean
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"
}

export function FormDialog({
    open,
    onOpenChange,
    title,
    children,
    onSave,
    onCancel,
    isSaving,
    maxWidth = "2xl",
}: FormDialogProps) {
    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        } else {
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("max-w-2xl max-h-[90vh] overflow-y-auto", `max-w-${maxWidth}`)}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {children}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                    </Button>
                    {onSave && (
                        <Button onClick={onSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
