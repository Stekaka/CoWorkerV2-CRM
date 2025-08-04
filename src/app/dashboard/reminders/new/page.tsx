import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import NewReminderForm from './new-reminder-form'

interface PageProps {
  searchParams?: {
    lead_id?: string
  }
}

export default async function NewReminderPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createClient()

  // Hämta alla leads för att kunna välja
  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, email, company')
    .eq('company_id', user.company_id)
    .order('name')

  // Hämta specifik lead om lead_id finns i query params
  let selectedLead = null
  if (searchParams?.lead_id) {
    const { data: lead } = await supabase
      .from('leads')
      .select('id, name, email, company')
      .eq('id', searchParams.lead_id)
      .eq('company_id', user.company_id)
      .single()
    
    selectedLead = lead
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/reminders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till påminnelser
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ny påminnelse</h1>
          <p className="text-gray-600">
            {selectedLead ? `Skapa påminnelse för ${selectedLead.name}` : 'Skapa en ny påminnelse'}
          </p>
        </div>
      </div>

      <NewReminderForm 
        leads={leads || []} 
        selectedLeadId={selectedLead?.id}
      />
    </div>
  )
}
