'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { useToast } from '@/hooks/use-toast'

interface Lead {
  id: string
  name: string
  email: string
  company?: string
}

interface NewReminderFormProps {
  leads: Lead[]
  selectedLeadId?: string
}

export default function NewReminderForm({ leads, selectedLeadId }: NewReminderFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    due_time: '09:00',
    lead_id: selectedLeadId || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Kombinera datum och tid
      const dueDateTime = new Date(`${formData.due_date}T${formData.due_time}:00`)

      const { error } = await supabase
        .from('reminders')
        .insert({
          title: formData.title,
          description: formData.description || null,
          due_date: dueDateTime.toISOString(),
          lead_id: formData.lead_id || null,
          completed: false
        })

      if (error) throw error

      toast({
        title: "Påminnelse skapad",
        description: "Påminnelsen har skapats framgångsrikt.",
      })

      // Navigera tillbaka till leads eller påminnelser beroende på varifrån vi kom
      if (formData.lead_id) {
        router.push(`/dashboard/leads/${formData.lead_id}`)
      } else {
        router.push('/dashboard/reminders')
      }
      router.refresh()
    } catch (error) {
      console.error('Error creating reminder:', error)
      toast({
        title: "Fel",
        description: "Kunde inte skapa påminnelsen. Försök igen.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Sätt minsta datum till idag
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Påminnelse-information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ring kund, skicka offert..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Ytterligare detaljer om påminnelsen..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Datum *</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                min={today}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_time">Tid *</Label>
              <Input
                id="due_time"
                type="time"
                value={formData.due_time}
                onChange={(e) => handleInputChange('due_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead_id">Kopplad till lead</Label>
            <Select value={formData.lead_id} onValueChange={(value: string) => handleInputChange('lead_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Välj lead (valfritt)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Ingen lead</SelectItem>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name} {lead.company && `- ${lead.company}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
        >
          Avbryt
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Skapar...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Skapa påminnelse
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
