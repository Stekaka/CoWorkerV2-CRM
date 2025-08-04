import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import LeadsList from './leads-list'

export default async function LeadsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('company_id', user.company_id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Hantera dina potentiella kunder</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/leads/new">
            <Plus className="w-4 h-4 mr-2" />
            Ny lead
          </Link>
        </Button>
      </div>

      <LeadsList leads={leads || []} />
    </div>
  )
}
