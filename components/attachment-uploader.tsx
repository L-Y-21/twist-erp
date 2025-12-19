"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, ImageIcon, File } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  uploadedBy: string
}

interface AttachmentUploaderProps {
  attachments: Attachment[]
  onUpload: (files: FileList) => void
  onDelete: (id: string) => void
  maxSize?: number // in MB
  accept?: string
}

export function AttachmentUploader({
  attachments,
  onUpload,
  onDelete,
  maxSize = 10,
  accept = "*",
}: AttachmentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      onUpload(e.dataTransfer.files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</div>
        <div className="text-xs text-muted-foreground mb-4">Maximum file size: {maxSize}MB</div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const input = document.createElement("input")
            input.type = "file"
            input.multiple = true
            input.accept = accept
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files
              if (files) onUpload(files)
            }
            input.click()
          }}
        >
          Browse Files
        </Button>
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Attachments ({attachments.length})</div>
          {attachments.map((file) => (
            <Card key={file.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()} • {file.uploadedBy}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => window.open(file.url, "_blank")}>
                    View
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(file.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
