import { DaoDetails } from './components/DaoDetails'

export default function DaoPage({ params }: { params: { id: string } }) {
  return <DaoDetails id={params.id} />
} 