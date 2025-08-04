import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import ReminderCard from './reminder-card'

export default async function RemindersPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createClient()

  const { data: reminders } = await supabase
    .from('reminders')
    .select(`
      *,
      leads (
        name,
        email
      )
    `)
    .eq('company_id', user.company_id)
    .order('due_date', { ascending: true })

  const upcomingReminders = reminders?.filter(r => !r.completed && new Date(r.due_date) >= new Date()) || []
  const overdueReminders = reminders?.filter(r => !r.completed && new Date(r.due_date) < new Date()) || []
  const completedReminders = reminders?.filter(r => r.completed) || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Påminnelser</h1>
          <p className="text-gray-600">Håll koll på viktiga datum och uppföljningar</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/reminders/new">
            <Plus className="w-4 h-4 mr-2" />
            Ny påminnelse
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Försenade påminnelser */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Försenade ({overdueReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueReminders.length > 0 ? (
              overdueReminders.map((reminder) => (
                <ReminderCard 
                  key={reminder.id} 
                  reminder={reminder} 
                  variant="overdue" 
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">Inga försenade påminnelser</p>
            )}
          </CardContent>
        </Card>

        {/* Kommande påminnelser */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-600 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Kommande ({upcomingReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingReminders.length > 0 ? (
              upcomingReminders.map((reminder) => (
                <ReminderCard 
                  key={reminder.id} 
                  reminder={reminder} 
                  variant="upcoming" 
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">Inga kommande påminnelser</p>
            )}
          </CardContent>
        </Card>

        {/* Slutförda påminnelser */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Slutförda ({completedReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedReminders.length > 0 ? (
              completedReminders.slice(0, 5).map((reminder) => (
                <ReminderCard 
                  key={reminder.id} 
                  reminder={reminder} 
                  variant="completed" 
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">Inga slutförda påminnelser</p>
            )}
          </CardContent>
        </Card>
      </div>

      {reminders && reminders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Inga påminnelser än
              </h3>
              <p className="text-gray-600 mb-6">
                Skapa påminnelser för att hålla koll på viktiga datum och uppföljningar
              </p>
              <Button asChild>
                <Link href="/dashboard/reminders/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Skapa första påminnelse
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
