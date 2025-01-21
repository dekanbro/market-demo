import { AboutTabs } from './components/AboutTabs'

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">About Agent Market</h1>
        <p className="text-lg text-muted-foreground">
          Learn about Agent Market through our documentation or chat with our help agent.
        </p>
      </div>
      <AboutTabs />
    </div>
  )
} 