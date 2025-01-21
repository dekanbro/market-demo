import { CreateTabs } from "./components/CreateTabs";


export default function CreatePage() {
  return (
    <div className="container max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Create a DAO</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to create your own DAO or start building one now.
        </p>
      </div>
      <CreateTabs />
    </div>
  )
} 