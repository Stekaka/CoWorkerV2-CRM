'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Plus, Search, Filter, Edit, Trash2, Phone, Mail, 
  MapPin, Calendar, TrendingUp, Star, DollarSign, Activity, Clock,
  Building
} from 'lucide-react'

interface Note {
  id: string
  content: string
  createdAt: string
  createdBy: string
  type: 'note' | 'email' | 'call' | 'meeting'
}

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  attendees: string[]
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost'
  priority: 'low' | 'medium' | 'high'
  source: 'website' | 'referral' | 'social_media' | 'trade_show' | 'email' | 'phone' | 'other'
  value: number
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed'
  lastContact: string
  nextFollowUp: string
  notes: Note[]
  meetings: Meeting[]
  tags: string[]
  score: number
}

// Empty mockdata - user should create their own leads
const mockLeads: Lead[] = []

const getStatusColor = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'qualified': return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'proposal': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    case 'closed_won': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'closed_lost': return 'bg-red-500/20 text-red-400 border-red-500/30'
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
}

const getStatusText = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'Ny'
    case 'contacted': return 'Kontaktad'
    case 'qualified': return 'Kvalificerad'
    case 'proposal': return 'Offert'
    case 'closed_won': return 'Vunnen'
    case 'closed_lost': return 'Förlorad'
    default: return status
  }
}

const getPriorityColor = (priority: Lead['priority']) => {
  switch (priority) {
    case 'high': return 'text-red-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-green-400'
    default: return 'text-slate-400'
  }
}

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leads, setLeads] = useState<Lead[]>(mockLeads)

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalValue = filteredLeads.reduce((sum: number, lead: Lead) => sum + lead.value, 0)
  const activeLeads = filteredLeads.filter(lead => !lead.status.includes('closed')).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 mobile-padding ios-height-fix">
      
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Leads</h1>
            <p className="text-slate-400">Hantera dina försäljningsmöjligheter</p>
          </div>
          <button
            className="mobile-button-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Ny Lead</span>
          </button>
        </motion.div>
      </div>

      {/* Leads List */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Inga leads att visa</h3>
          <p className="text-slate-400 mb-6">
            Lägg till din första lead för att komma igång.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mobile-button-primary"
          >
            <Plus className="w-5 h-5" />
            <span>Lägg till Lead</span>
          </button>
        </div>
      </div>
    </div>
  )
}
