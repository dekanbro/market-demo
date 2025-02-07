'use client'

import { useState, DragEvent } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HardDriveIcon, Upload } from "lucide-react"

export function RatifyDialog() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Drag and drop handlers
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const documents = files.filter(file => 
      file.type.match('application/pdf|text/plain|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    )

    if (documents.length > 0) {
      setUploadedFiles(prev => [...prev, ...documents])
      console.log('Files to upload:', documents)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="flex-1">
          <HardDriveIcon className="mr-2 h-4 w-4" />
          Ratify Docs
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ratify DAO Documents</DialogTitle>
          <DialogDescription className="space-y-3 pt-3">
            Ratifying documents allows you to make information canonical for the DAO's AI agent. 
            This process requires creating a proposal that members can vote on.
            <span className="inline-block pt-2">
            Once ratified, these documents become part of the DAO's permanent knowledge base, 
            enhancing the AI agent's ability to provide accurate information and make informed decisions.
            </span>
            <span className="inline-block font-semibold text-primary pt-2">
              This feature is coming soon! 🚀
            </span>
          </DialogDescription>
        </DialogHeader>
        <div 
          className={`border-2 border-dashed p-4 mt-4 ${isDragging ? 'border-primary' : 'border-muted'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center h-32">
            <Upload className="h-8 w-8 text-muted" />
            <p className="text-sm text-muted-foreground mt-2">Drag and drop documents here to upload</p>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Uploaded Documents:</p>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 