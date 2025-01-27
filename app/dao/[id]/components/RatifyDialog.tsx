'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HardDriveIcon } from "lucide-react"

export function RatifyDialog() {
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
            <p>
              Ratifying documents allows you to make information canonical for the DAO's AI agent. 
              This process requires creating a proposal that members can vote on.
            </p>
            <p>
              Once ratified, these documents become part of the DAO's permanent knowledge base, 
              enhancing the AI agent's ability to provide accurate information and make informed decisions.
            </p>
            <p className="font-semibold text-primary">
              This feature is coming soon! 🚀
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
} 