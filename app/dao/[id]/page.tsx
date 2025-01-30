import { DaoDetails } from './components/DaoDetails'
import { getDaoById } from '@/app/lib/dao-service'
import { notFound } from 'next/navigation'

// This is a Server Component
export default async function DaoPage({ params }: { params: { id: string } }) {
  try {
    // Pre-fetch the DAO data on the server
    const dao = await getDaoById(params.id)
    
    if (!dao) {
      notFound()
    }

    return (
      <DaoDetails initialDao={dao} id={params.id} />
    )
  } catch (error) {
    console.error('Error loading DAO:', error)
    notFound()
  }
}

// Disable static generation for now since data is dynamic
export const dynamic = 'force-dynamic' 