'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ExternalLink } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Lead {
  name: string
  email: string
}

interface Reminder {
  id: string
  title: string
  description?: string
  due_date: string
  completed: boolean
  lead_id?: string
  leads?: Lead
}

interface ReminderCardProps {
  reminder: Reminder
  variant: 'overdue' | 'upcoming' | 'completed'
}

export default function ReminderCard({ reminder, variant }: ReminderCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('reminders')
        .update({ completed: !reminder.completed })
        .eq('id', reminder.id)

      if (error) throw error

      toast({
        title: reminder.completed ? "Påminnelse öppnad" : "Påminnelse slutförd",
        description: reminder.completed 
          ? "Påminnelsen har markerats som ej slutförd." 
          : "Påminnelsen har markerats som slutförd.",
      })

      router.refresh()
    } catch (error) {
      console.error('Error updating reminder:', error)
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera påminnelsen. Försök igen.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'overdue':
        return 'bg-red-50 border-red-200'
      case 'upcoming':
        return 'bg-blue-50 border-blue-200'
      case 'completed':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case 'overdue':
        return 'text-red-900'
      case 'upcoming':
        return 'text-blue-900'
      case 'completed':
        return 'text-green-900'
      default:
        return 'text-gray-900'
    }
  }

  const getSubTextColor = () => {
    switch (variant) {
      case 'overdue':
        return 'text-red-700'
      case 'upcoming':
        return 'text-blue-700'
      case 'completed':
        return 'text-green-700'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div className={`p-3 rounded-lg border ${getVariantStyles()}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className={`font-medium ${getTextColor()}`}>
            {reminder.title}
          </h4>
          {reminder.description && (
            <p className={`text-sm mt-1 ${getSubTextColor()}`}>
              {reminder.description}
            </p>
          )}
          <p className={`text-xs mt-2 ${getSubTextColor()}`}>
            {variant === 'overdue' && 'Förfallen: '}
            {variant === 'completed' && 'Slutförd: '}
            {formatDateTime(reminder.due_date)}
          </p>
          {reminder.leads && (
            <div className="flex items-center justify-between mt-2">
              <p className={`text-xs ${getSubTextColor()}`}>
                Lead: {reminder.leads.name}
              </p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-6 px-2 text-xs"
              >
                <Link href={`/dashboard/leads/${reminder.lead_id}`}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Visa
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {variant !== 'completed' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleComplete}
            disabled={loading}
            className="ml-2 h-8 w-8 p-0"
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
