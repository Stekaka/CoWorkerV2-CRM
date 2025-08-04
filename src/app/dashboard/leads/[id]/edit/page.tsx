import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import EditLeadForm from './edit-lead-form'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditLeadPage({ params }: PageProps) {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createClient()

  // Hämta lead-data
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', params.id)
    .eq('company_id', user.company_id)
    .single()

  if (!lead) {
    notFound()
  }

  // Hämta alla användare i företaget för tilldelning
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('company_id', user.company_id)
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Redigera lead</h1>
        <p className="text-gray-600">Uppdatera information för {lead.name}</p>
      </div>

      <EditLeadForm lead={lead} users={users || []} />
    </div>
  )
}
