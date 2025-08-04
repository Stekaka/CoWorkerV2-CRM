'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Phone, Building, Search, Filter, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: string
  tags?: string[]
  notes?: string
  created_at: string
}

interface LeadsListProps {
  leads: Lead[]
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Alla statusar' },
  { value: 'new', label: 'Ny' },
  { value: 'contacted', label: 'Kontaktad' },
  { value: 'qualified', label: 'Kvalificerad' },
  { value: 'proposal', label: 'Offert' },
  { value: 'won', label: 'Vunnen' },
  { value: 'lost', label: 'Förlorad' }
]

export default function LeadsList({ leads }: LeadsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.tags && lead.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [leads, searchTerm, statusFilter])

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

  return (
    <div className="space-y-6">
      {/* Sök och filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Sök leads (namn, e-post, företag, taggar...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value)}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
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
          </div>
          
          {/* Resultat räknare */}
          <div className="mt-4 text-sm text-gray-600">
            Visar {filteredLeads.length} av {leads.length} leads
          </div>
        </CardContent>
      </Card>

      {/* Leads lista */}
      {filteredLeads.length > 0 ? (
        <div className="grid gap-6">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {lead.email}
                    </CardDescription>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {getStatusText(lead.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    {lead.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {lead.phone}
                      </div>
                    )}
                    {lead.company && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        {lead.company}
                      </div>
                    )}
                  </div>

                  <div>
                    {lead.tags && lead.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Taggar:</p>
                        <div className="flex flex-wrap gap-1">
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
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Skapad: {formatDate(lead.created_at)}
                    </p>
                    <div className="mt-2 space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/leads/${lead.id}`}>
                          Visa
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/leads/${lead.id}/edit`}>
                          Redigera
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {lead.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{lead.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Inga leads matchar din sökning' 
                  : 'Inga leads än'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Försök med andra sökord eller filter'
                  : 'Kom igång genom att skapa din första lead'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button asChild>
                  <Link href="/dashboard/leads/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Skapa första lead
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
