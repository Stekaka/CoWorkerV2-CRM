import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, Building, Calendar, User, Edit, Plus } from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export default async function LeadDetailPage({ params }: PageProps) {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createClient()

  // Hämta lead med relaterade påminnelser
  const { data: lead } = await supabase
    .from('leads')
    .select(`
      *,
      assigned_to:users!leads_assigned_to_fkey (
        name,
        email
      )
    `)
    .eq('id', params.id)
    .eq('company_id', user.company_id)
    .single()

  if (!lead) {
    notFound()
  }

  // Hämta påminnelser för denna lead
  const { data: reminders } = await supabase
    .from('reminders')
    .select(`
      *,
      created_by:users!reminders_created_by_fkey (
        name
      )
    `)
    .eq('lead_id', params.id)
    .eq('company_id', user.company_id)
    .order('due_date', { ascending: true })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      case 'qualified': return 'bg-yellow-100 text-yellow-800'
      case 'proposal': return 'bg-purple-100 text-purple-800'
      case 'won': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Ny'
      case 'contacted': return 'Kontaktad'
      case 'qualified': return 'Kvalificerad'
      case 'proposal': return 'Offert'
      case 'won': return 'Vunnen'
      case 'lost': return 'Förlorad'
      default: return status
    }
  }

  const upcomingReminders = reminders?.filter(r => !r.completed && new Date(r.due_date) >= new Date()) || []
  const overdueReminders = reminders?.filter(r => !r.completed && new Date(r.due_date) < new Date()) || []
  const completedReminders = reminders?.filter(r => r.completed) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/leads">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka till leads
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-600">Lead-detaljer</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/leads/${lead.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Redigera
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/reminders/new?lead_id=${lead.id}`}>
              <Plus className="w-4 h-4 mr-2" />
              Ny påminnelse
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Kontaktinformation</CardTitle>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                  {getStatusText(lead.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">E-post</p>
                    <p className="text-gray-900">{lead.email}</p>
                  </div>
                </div>
                
                {lead.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefon</p>
                      <p className="text-gray-900">{lead.phone}</p>
                    </div>
                  </div>
                )}

                {lead.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Företag</p>
                      <p className="text-gray-900">{lead.company}</p>
                    </div>
                  </div>
                )}

                {lead.assigned_to && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tilldelad till</p>
                      <p className="text-gray-900">{lead.assigned_to.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {lead.tags && lead.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Taggar</p>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Skapad</p>
                  <p className="text-gray-900">{formatDate(lead.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {lead.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Anteckningar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reminders Sidebar */}
        <div className="space-y-6">
          {/* Overdue Reminders */}
          {overdueReminders.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Försenade påminnelser</CardTitle>
                <CardDescription>{overdueReminders.length} påminnelse(r)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {overdueReminders.map((reminder) => (
                  <div key={reminder.id} className="p-3 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-900">{reminder.title}</h4>
                    <p className="text-sm text-red-700">{formatDateTime(reminder.due_date)}</p>
                    {reminder.description && (
                      <p className="text-sm text-red-600 mt-1">{reminder.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Reminders */}
          {upcomingReminders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Kommande påminnelser</CardTitle>
                <CardDescription>{upcomingReminders.length} påminnelse(r)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingReminders.map((reminder) => (
                  <div key={reminder.id} className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">{reminder.title}</h4>
                    <p className="text-sm text-blue-700">{formatDateTime(reminder.due_date)}</p>
                    {reminder.description && (
                      <p className="text-sm text-blue-600 mt-1">{reminder.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Slutförda påminnelser</CardTitle>
                <CardDescription>{completedReminders.length} påminnelse(r)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedReminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">{reminder.title}</h4>
                    <p className="text-sm text-green-700">{formatDateTime(reminder.due_date)}</p>
                  </div>
                ))}
                {completedReminders.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{completedReminders.length - 3} fler slutförda
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* No reminders */}
          {reminders && reminders.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Påminnelser</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-6">
                <p className="text-gray-500 mb-4">Inga påminnelser än</p>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/reminders/new?lead_id=${lead.id}`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Skapa påminnelse
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
