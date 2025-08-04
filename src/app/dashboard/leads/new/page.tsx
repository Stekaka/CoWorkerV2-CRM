'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase-client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewLeadPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new' as const,
    tags: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Hämta användarinfo för company_id
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Du måste vara inloggad')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single()

      if (!userData) {
        setError('Kunde inte hitta användardata')
        return
      }

      // Konvertera tags från sträng till array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const { error: insertError } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          status: formData.status,
          tags: tagsArray,
          notes: formData.notes || null,
          company_id: userData.company_id,
          assigned_to: user.id
        }])

      if (insertError) {
        setError('Kunde inte skapa lead: ' + insertError.message)
        return
      }

      router.push('/dashboard/leads')
      router.refresh()
    } catch {
      setError('Ett oväntat fel inträffade')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/leads">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till leads
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ny lead</h1>
          <p className="text-gray-600">Lägg till en ny potentiell kund</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead-information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Namn *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Anna Andersson"
                />
              </div>

              <div>
                <Label htmlFor="email">E-postadress *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="anna@exempel.se"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                  placeholder="070-123 45 67"
                />
              </div>

              <div>
                <Label htmlFor="company">Företag</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="mt-1"
                  placeholder="Exempel AB"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="new">Ny</option>
                  <option value="contacted">Kontaktad</option>
                  <option value="qualified">Kvalificerad</option>
                  <option value="proposal">Offert</option>
                  <option value="won">Vunnen</option>
                  <option value="lost">Förlorad</option>
                </select>
              </div>

              <div>
                <Label htmlFor="tags">Taggar</Label>
                <Input
                  id="tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="mt-1"
                  placeholder="webb, design, startup (separera med komma)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separera taggar med komma
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Anteckningar</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-1"
                rows={4}
                placeholder="Lägg till anteckningar om denna lead..."
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/leads">Avbryt</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Skapar...' : 'Skapa lead'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
