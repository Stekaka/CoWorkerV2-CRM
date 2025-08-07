'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Plus, Phone, Mail, Calendar, TrendingUp, Users, Star, 
  Edit3, Save, X, MessageSquare, Clock, Building, MapPin, 
  FileText, CheckCircle, AlertCircle, User, Target, DollarSign,
  Activity, Briefcase, Tag, ChevronRight, ExternalLink
} from 'lucide-react'

interface Note {
  id: string
  content: string
  createdAt: string
  createdBy: string
  type: 'note' | 'call' | 'meeting' | 'email'
}

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  duration: number
  type: 'call' | 'meeting' | 'demo'
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost'
  value: number
  source: string
  lastActivity: string
  assignedTo: string
  priority: 'low' | 'medium' | 'high'
  address?: string
  title?: string
  website?: string
  industry?: string
  employees?: number
  notes: Note[]
  meetings: Meeting[]
  tags: string[]
  score: number
  nextFollowUp?: string
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Anna Andersson',
    company: 'TechStart AB',
    email: 'anna@techstart.se',
    phone: '+46 70 123 45 67',
    status: 'qualified',
    value: 150000,
    source: 'Website',
    lastActivity: '2024-01-15',
    assignedTo: 'Johan Svensson',
    priority: 'high',
    title: 'CTO',
    address: 'Storgatan 12, 111 23 Stockholm',
    website: 'https://techstart.se',
    industry: 'Technology',
    employees: 25,
    score: 85,
    nextFollowUp: '2024-01-20',
    tags: ['Enterprise', 'SaaS', 'Hot Lead'],
    notes: [
      {
        id: '1',
        content: 'Mycket intresserad av vår lösning. Nästa steg är demo nästa vecka.',
        createdAt: '2024-01-15 14:30',
        createdBy: 'Johan Svensson',
        type: 'call'
      },
      {
        id: '2',
        content: 'Skickade kompletterande information om integration möjligheter.',
        createdAt: '2024-01-12 09:15',
        createdBy: 'Johan Svensson',
        type: 'email'
      }
    ],
    meetings: [
      {
        id: '1',
        title: 'Produktdemo',
        date: '2024-01-22',
        time: '14:00',
        duration: 60,
        type: 'demo',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '2',
    name: 'Erik Nilsson',
    company: 'Innovation Corp',
    email: 'erik@innovation.se',
    phone: '+46 70 234 56 78',
    status: 'new',
    value: 75000,
    source: 'LinkedIn',
    lastActivity: '2024-01-14',
    assignedTo: 'Maria Karlsson',
    priority: 'medium',
    title: 'VD',
    industry: 'Consulting',
    employees: 50,
    score: 60,
    tags: ['SME', 'Consulting'],
    notes: [
      {
        id: '3',
        content: 'Första kontakt via LinkedIn. Behöver mer information om prissättning.',
        createdAt: '2024-01-14 16:45',
        createdBy: 'Maria Karlsson',
        type: 'note'
      }
    ],
    meetings: []
  },
  {
    id: '3',
    name: 'Sofia Larsson',
    company: 'Digital Solutions',
    email: 'sofia@digital.se',
    phone: '+46 70 345 67 89',
    status: 'proposal',
    value: 200000,
    source: 'Referral',
    lastActivity: '2024-01-13',
    assignedTo: 'Johan Svensson',
    priority: 'high',
    title: 'Marknadschef',
    industry: 'Marketing',
    employees: 35,
    score: 90,
    nextFollowUp: '2024-01-18',
    tags: ['Enterprise', 'Marketing Tech', 'Referral'],
    notes: [
      {
        id: '4',
        content: 'Offert skickad. Väntar på besked från styrelsen.',
        createdAt: '2024-01-13 11:20',
        createdBy: 'Johan Svensson',
        type: 'note'
      }
    ],
    meetings: [
      {
        id: '2',
        title: 'Uppföljning offert',
        date: '2024-01-18',
        time: '10:00',
        duration: 30,
        type: 'call',
        status: 'scheduled'
      }
    ]
  }
]

const getStatusColor = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case 'contacted': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    case 'qualified': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    case 'proposal': return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    case 'closed-won': return 'bg-green-500/10 text-green-400 border-green-500/30'
    case 'closed-lost': return 'bg-red-500/10 text-red-400 border-red-500/30'
  }
}

const getStatusText = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'Ny Lead'
    case 'contacted': return 'Kontaktad'
    case 'qualified': return 'Kvalificerad'
    case 'proposal': return 'Offert Skickad'
    case 'closed-won': return 'Avslutad - Vunnen'
    case 'closed-lost': return 'Avslutad - Förlorad'
  }
}

const getPriorityColor = (priority: Lead['priority']) => {
  switch (priority) {
    case 'high': return 'text-red-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-green-400'
  }
}

const getNoteTypeIcon = (type: Note['type']) => {
  switch (type) {
    case 'call': return <Phone className="w-4 h-4" />
    case 'meeting': return <Calendar className="w-4 h-4" />
    case 'email': return <Mail className="w-4 h-4" />
    case 'note': return <FileText className="w-4 h-4" />
  }
}

const getNoteTypeColor = (type: Note['type']) => {
  switch (type) {
    case 'call': return 'text-green-400'
    case 'meeting': return 'text-blue-400'
    case 'email': return 'text-purple-400'
    case 'note': return 'text-slate-400'
  }
}

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'meetings' | 'activity'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    type: 'call' as 'call' | 'meeting' | 'demo'
  })

  console.log('✅ FULL CRM LEADS PAGE LOADED!')

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedLead) return
    
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toLocaleString('sv-SE'),
      createdBy: 'Du',
      type: 'note'
    }
    
    selectedLead.notes.unshift(note)
    setNewNote('')
  }

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time || !selectedLead) return
    
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: newMeeting.date,
      time: newMeeting.time,
      duration: 30,
      type: newMeeting.type,
      status: 'scheduled'
    }
    
    selectedLead.meetings.push(meeting)
    setNewMeeting({ title: '', date: '', time: '', type: 'call' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-light text-white mb-2">Leads & CRM</h1>
            <p className="text-slate-400">Hantera dina potentiella kunder och affärsmöjligheter</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5" />
            Ny Lead
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">{filteredLeads.length}</span>
            </div>
            <p className="text-slate-400 text-sm">Totalt Leads</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">
                {filteredLeads.filter(l => l.status === 'qualified' || l.status === 'proposal').length}
              </span>
            </div>
            <p className="text-slate-400 text-sm">Hot Leads</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{filteredLeads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString('sv-SE')} kr</span>
            </div>
            <p className="text-slate-400 text-sm">Pipeline Värde</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">{filteredLeads.filter(lead => !lead.status.includes('closed')).length}</span>
            </div>
            <p className="text-slate-400 text-sm">Aktiva Leads</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Sök leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
          >
            <option value="all">Alla Status</option>
            <option value="new">Ny</option>
            <option value="contacted">Kontaktad</option>
            <option value="qualified">Kvalificerad</option>
            <option value="proposal">Offert</option>
            <option value="closed-won">Vunnen</option>
            <option value="closed-lost">Förlorad</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left p-4 text-slate-300 font-medium">Lead</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Företag</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Värde</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Score</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Nästa steg</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedLead(lead)
                      setActiveTab('overview')
                      setIsEditing(false)
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-white">{lead.name}</p>
                            <span className={`w-2 h-2 rounded-full ${getPriorityColor(lead.priority)}`} />
                          </div>
                          <p className="text-sm text-slate-400">{lead.title || 'Kontakt'}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lead.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-slate-700/50 text-xs text-slate-300 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{lead.company}</p>
                        <p className="text-sm text-slate-400">{lead.industry}</p>
                        {lead.employees && (
                          <p className="text-xs text-slate-500">{lead.employees} anställda</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(lead.status)}`}>
                        {getStatusText(lead.status)}
                      </span>
                    </td>
                    <td className="p-4 text-white font-medium">{lead.value.toLocaleString('sv-SE')} kr</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              lead.score >= 80 ? 'bg-green-500' : 
                              lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-300">{lead.score}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {lead.nextFollowUp ? (
                        <div className="text-sm">
                          <p className="text-slate-300">{lead.nextFollowUp}</p>
                          <p className="text-xs text-slate-500">Uppföljning</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">Ingen planerad</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${lead.phone}`)
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`mailto:${lead.email}`)
                          }}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLead(lead)
                            setActiveTab('overview')
                          }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Enhanced Lead Detail Modal */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedLead(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedLead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedLead.name}</h2>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-slate-300">{selectedLead.title}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">{selectedLead.company}</span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedLead.status)}`}>
                          {getStatusText(selectedLead.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                  {[
                    { id: 'overview', label: 'Översikt', icon: User },
                    { id: 'notes', label: 'Anteckningar', icon: MessageSquare },
                    { id: 'meetings', label: 'Möten', icon: Calendar },
                    { id: 'activity', label: 'Aktivitet', icon: Activity }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-cyan-400 border-b-2 border-cyan-400'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2" />
                          Kontaktinformation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="text-slate-400 text-sm">Email</label>
                              <div className="flex items-center space-x-2">
                                <p className="text-white">{selectedLead.email}</p>
                                <button
                                  onClick={() => window.open(`mailto:${selectedLead.email}`)}
                                  className="text-slate-400 hover:text-blue-400"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="text-slate-400 text-sm">Telefon</label>
                              <div className="flex items-center space-x-2">
                                <p className="text-white">{selectedLead.phone}</p>
                                <button
                                  onClick={() => window.open(`tel:${selectedLead.phone}`)}
                                  className="text-slate-400 hover:text-green-400"
                                >
                                  <Phone className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {selectedLead.address && (
                              <div>
                                <label className="text-slate-400 text-sm">Adress</label>
                                <p className="text-white">{selectedLead.address}</p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-slate-400 text-sm">Källa</label>
                              <p className="text-white">{selectedLead.source}</p>
                            </div>
                            <div>
                              <label className="text-slate-400 text-sm">Ansvarig</label>
                              <p className="text-white">{selectedLead.assignedTo}</p>
                            </div>
                            <div>
                              <label className="text-slate-400 text-sm">Prioritet</label>
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                selectedLead.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                                selectedLead.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-green-500/10 text-green-400'
                              }`}>
                                {selectedLead.priority.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Company Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <Building className="w-5 h-5 mr-2" />
                          Företagsinformation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="text-slate-400 text-sm">Bransch</label>
                              <p className="text-white">{selectedLead.industry || 'Ej specificerad'}</p>
                            </div>
                            <div>
                              <label className="text-slate-400 text-sm">Anställda</label>
                              <p className="text-white">{selectedLead.employees || 'Okänt'}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {selectedLead.website && (
                              <div>
                                <label className="text-slate-400 text-sm">Webbsida</label>
                                <div className="flex items-center space-x-2">
                                  <p className="text-white">{selectedLead.website}</p>
                                  <button
                                    onClick={() => window.open(selectedLead.website, '_blank')}
                                    className="text-slate-400 hover:text-blue-400"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sales Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2" />
                          Försäljningsinformation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-slate-400 text-sm">Potentiellt värde</label>
                            <p className="text-2xl font-bold text-white">
                              {selectedLead.value.toLocaleString('sv-SE')} kr
                            </p>
                          </div>
                          <div>
                            <label className="text-slate-400 text-sm">Lead Score</label>
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 bg-slate-700 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full ${
                                    selectedLead.score >= 80 ? 'bg-green-500' : 
                                    selectedLead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${selectedLead.score}%` }}
                                />
                              </div>
                              <span className="text-white font-medium">{selectedLead.score}</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-slate-400 text-sm">Nästa uppföljning</label>
                            <p className="text-white">{selectedLead.nextFollowUp || 'Ej planerad'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <Tag className="w-5 h-5 mr-2" />
                          Taggar
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedLead.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Anteckningar</h3>
                      </div>
                      
                      {/* Add Note */}
                      <div className="bg-slate-800/30 rounded-xl p-4">
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Skriv en ny anteckning..."
                          className="w-full bg-slate-700/50 border border-slate-600/30 rounded-lg p-3 text-white placeholder-slate-400 resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={handleAddNote}
                            disabled={!newNote.trim()}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Lägg till anteckning
                          </button>
                        </div>
                      </div>

                      {/* Notes List */}
                      <div className="space-y-4">
                        {selectedLead.notes.map(note => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/30 rounded-xl p-4"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${getNoteTypeColor(note.type)}`}>
                                {getNoteTypeIcon(note.type)}
                              </div>
                              <div className="flex-1">
                                <p className="text-white mb-2">{note.content}</p>
                                <div className="flex items-center space-x-2 text-sm text-slate-400">
                                  <span>{note.createdBy}</span>
                                  <span>•</span>
                                  <span>{note.createdAt}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'meetings' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Möten</h3>
                      </div>

                      {/* Add Meeting */}
                      <div className="bg-slate-800/30 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-3">Boka nytt möte</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-400 text-sm mb-1 block">Titel</label>
                            <input
                              type="text"
                              value={newMeeting.title}
                              onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                              className="w-full bg-slate-700/50 border border-slate-600/30 rounded-lg p-2 text-white"
                              placeholder="T.ex. Produktdemo"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 text-sm mb-1 block">Typ</label>
                            <select
                              value={newMeeting.type}
                              onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value as any})}
                              className="w-full bg-slate-700/50 border border-slate-600/30 rounded-lg p-2 text-white"
                            >
                              <option value="call">Telefonsamtal</option>
                              <option value="meeting">Fysiskt möte</option>
                              <option value="demo">Demo</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-slate-400 text-sm mb-1 block">Datum</label>
                            <input
                              type="date"
                              value={newMeeting.date}
                              onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                              className="w-full bg-slate-700/50 border border-slate-600/30 rounded-lg p-2 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 text-sm mb-1 block">Tid</label>
                            <input
                              type="time"
                              value={newMeeting.time}
                              onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                              className="w-full bg-slate-700/50 border border-slate-600/30 rounded-lg p-2 text-white"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={handleAddMeeting}
                            disabled={!newMeeting.title || !newMeeting.date || !newMeeting.time}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Boka möte
                          </button>
                        </div>
                      </div>

                      {/* Meetings List */}
                      <div className="space-y-4">
                        {selectedLead.meetings.map(meeting => (
                          <motion.div
                            key={meeting.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/30 rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-medium">{meeting.title}</h4>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-slate-400">
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{meeting.date}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{meeting.time}</span>
                                  </span>
                                  <span className="capitalize">{meeting.type}</span>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs ${
                                meeting.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                                meeting.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                'bg-red-500/10 text-red-400'
                              }`}>
                                {meeting.status === 'scheduled' ? 'Inbokad' :
                                 meeting.status === 'completed' ? 'Genomförd' : 'Inställd'}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                        {selectedLead.meetings.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Inga möten inbokade</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white">Aktivitetshistorik</h3>
                      
                      <div className="space-y-4">
                        {/* Combined activity feed */}
                        {[
                          ...selectedLead.notes.map(note => ({
                            type: 'note',
                            content: note.content,
                            date: note.createdAt,
                            by: note.createdBy,
                            noteType: note.type
                          })),
                          ...selectedLead.meetings.map(meeting => ({
                            type: 'meeting',
                            content: `${meeting.title} (${meeting.type})`,
                            date: `${meeting.date} ${meeting.time}`,
                            by: 'System',
                            status: meeting.status
                          }))
                        ]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3 p-4 bg-slate-800/30 rounded-xl"
                          >
                            <div className={`p-2 rounded-lg ${
                              activity.type === 'note' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                            }`}>
                              {activity.type === 'note' ? 
                                <MessageSquare className="w-4 h-4" /> : 
                                <Calendar className="w-4 h-4" />
                              }
                            </div>
                            <div className="flex-1">
                              <p className="text-white">{activity.content}</p>
                              <div className="flex items-center space-x-2 mt-1 text-sm text-slate-400">
                                <span>{activity.by}</span>
                                <span>•</span>
                                <span>{activity.date}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-700 p-6">
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.open(`tel:${selectedLead.phone}`)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Ring upp
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.open(`mailto:${selectedLead.email}`)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Skicka email
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('meetings')}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Boka möte
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('notes')}
                      className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Lägg till anteckning
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
