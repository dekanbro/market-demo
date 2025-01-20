import { DaoList } from "../components/DaoList";


export default function DaosPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">DAOs Explorer</h1>
      <DaoList />
    </div>
  )
} 