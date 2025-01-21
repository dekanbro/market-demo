import { Card } from "@/components/ui/card"
import { docs } from "../content/docs"
import ReactMarkdown from "react-markdown"

export function DocsContent() {
  return (
    <div className="space-y-8">
      {Object.entries(docs).map(([key, content]) => (
        <Card key={key} className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </Card>
      ))}
    </div>
  )
} 