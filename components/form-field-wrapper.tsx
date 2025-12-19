"use client"

import { Label } from "@/components/ui/label"
import type { ReactNode } from "react"

interface FormFieldWrapperProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  htmlFor?: string
}

export function FormFieldWrapper({ label, required, error, children, htmlFor }: FormFieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
