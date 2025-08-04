'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  name: string
  email: string
}

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: string
  assigned_to?: string
  tags?: string[]
  notes?: string
}

interface EditLeadFormProps {
  lead: Lead
  users: User[]
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Ny' },
  { value: 'contacted', label: 'Kontaktad' },
  { value: 'qualified', label: 'Kvalificerad' },
  { value: 'proposal', label: 'Offert' },
  { value: 'won', label: 'Vunnen' },
  { value: 'lost', label: 'Förlorad' }
]

export default function EditLeadForm({ lead, users }: EditLeadFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone || '',
    company: lead.company || '',
    status: lead.status,
    assigned_to: lead.assigned_to || '',
    tags: lead.tags?.join(', ') || '',
    notes: lead.notes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Behandla taggar
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        status: formData.status,
        assigned_to: formData.assigned_to || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        notes: formData.notes || null
      }

      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', lead.id)

      if (error) throw error

      toast({
        title: "Lead uppdaterad",
        description: "Leaden har uppdaterats framgångsrikt.",
      })

      router.push(`/dashboard/leads/${lead.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error updating lead:', error)
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera leaden. Försök igen.",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button type="button" variant="outline" size="sm" asChild>
          <Link href={`/dashboard/leads/${lead.id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead-information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Namn *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-post *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+46 70 123 45 67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Företag</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Företag AB"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: string) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_to">Tilldelad till</Label>
              <Select value={formData.assigned_to} onValueChange={(value: string) => handleInputChange('assigned_to', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj användare" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ingen tilldelning</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Taggar</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="kund, viktig, snabb (separera med komma)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Anteckningar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Anteckningar om leaden..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" asChild>
          <Link href={`/dashboard/leads/${lead.id}`}>Avbryt</Link>
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sparar...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Spara ändringar
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
