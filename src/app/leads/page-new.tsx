'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Filter, Building, Mail, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  priority: 'low' | 'medium' | 'high'
  created_at: string
}

const getStatusColor = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case 'contacted': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    case 'qualified': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    case 'proposal': return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    case 'won': return 'bg-green-500/10 text-green-400 border-green-500/30'
    case 'lost': return 'bg-red-500/10 text-red-400 border-red-500/30'
  }
}

const getStatusText = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'Ny Lead'
    case 'contacted': return 'Kontaktad'
    case 'qualified': return 'Kvalificerad'
    case 'proposal': return 'Offert Skickad'
    case 'won': return 'Avslutad - Vunnen'
    case 'lost': return 'Avslutad - Förlorad'
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedLeads: Lead[] = data?.map(lead => ({
        id: lead.id,
        name: lead.name || '',
        company: lead.company || '',
        email: lead.email || '',
        phone: lead.phone || '',
        status: lead.status as Lead['status'] || 'new',
        priority: 'medium' as Lead['priority'],
        created_at: lead.created_at
      })) || []

      setLeads(formattedLeads)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Laddar leads...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Leads</h1>
              <p className="text-slate-400">{filteredLeads.length} leads totalt</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Ny Lead</span>
          </button>
        </motion.div>

        {/* Search & Filter */}
        <motion.div 
          className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Sök efter namn, företag eller email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none"
              >
                <option value="all">Alla status</option>
                <option value="new">Nya</option>
                <option value="contacted">Kontaktade</option>
                <option value="qualified">Kvalificerade</option>
                <option value="proposal">Offert skickad</option>
                <option value="won">Vunna</option>
                <option value="lost">Förlorade</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Leads Grid */}
        {filteredLeads.length === 0 ? (
          <motion.div 
            className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Inga leads hittades</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Ändra din sökning eller filter för att se fler results.'
                : 'Kom igång genom att lägga till din första lead.'
              }
            </p>
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 mx-auto transition-colors">
              <Plus className="w-4 h-4" />
              <span>Lägg till Lead</span>
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{lead.name || 'Okänd'}</h3>
                    <div className="flex items-center text-slate-400 text-sm mb-2">
                      <Building className="w-4 h-4 mr-1" />
                      {lead.company || 'Okänt företag'}
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                    {getStatusText(lead.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {lead.email && (
                    <div className="flex items-center text-slate-400 text-sm">
                      <Mail className="w-4 h-4 mr-2" />
                      {lead.email}
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center text-slate-400 text-sm">
                      <Phone className="w-4 h-4 mr-2" />
                      {lead.phone}
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-500">
                  Skapad: {new Date(lead.created_at).toLocaleDateString('sv-SE')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
