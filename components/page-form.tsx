"use client"

import * as React from "react"
import { ChevronLeft, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface PageFormProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    title?: string
    backLink?: string
    onSave?: () => void
    onCancel?: () => void
    isSaving?: boolean
    actionButtons?: React.ReactNode
}

export function PageForm({
    children,
    title,
    backLink,
    onSave,
    onCancel,
    isSaving,
    actionButtons,
    className,
    ...props
}: PageFormProps) {
    const router = useRouter()

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        } else if (backLink) {
            router.push(backLink)
        } else {
            router.back()
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {/* Header / Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 py-2 -mx-2 px-2">
                <div className="flex items-center gap-4">
                    {backLink && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(backLink)}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                    )}
                    <div>
                        {title && <h1 className="text-xl font-bold tracking-tight">{title}</h1>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {actionButtons}
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                        <X className="mr-2 h-4 w-4" />
                        Discard
                    </Button>
                    {onSave && (
                        <Button size="sm" onClick={onSave} disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Form Sheet */}
            <div className="form-sheet animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
            </div>
        </div>
    )
}
