"use client"

import { type ReactNode, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PrintTemplateProps {
  children: ReactNode
  title?: string
  headerContent?: ReactNode
  footerContent?: ReactNode
}

export function PrintTemplate({ children, title, headerContent, footerContent }: PrintTemplateProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div>
      <div className="mb-4 no-print">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
      <div ref={printRef} className="print-area">
        {headerContent && <div className="print-header">{headerContent}</div>}
        <div className="print-content">{children}</div>
        {footerContent && <div className="print-footer">{footerContent}</div>}
      </div>
    </div>
  )
}
