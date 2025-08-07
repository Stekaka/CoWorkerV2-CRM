'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Edit,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building2,
  User,
  Calendar,
  MessageSquare,
  DollarSign,
  Star,
  CheckCircle2,
  Circle
} from 'lucide-react'
import { Lead, Activity, getActivityIcon } from '@/lib/crm-data'

interface LeadProfileProps {
  lead: Lead
  onClose: () => void
  onUpdate: (lead: Lead) => void
}

export default function LeadProfile({ lead, onClose, onUpdate }: LeadProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'orders' | 'notes'>('overview')
  const [newNote, setNewNote] = useState('')
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    type: 'note' as Activity['type'],
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5)
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString)
    const time = timeString || '00:00'
    return `${date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} ${time}`
  }

  const handleAddActivity = () => {
    if (!newActivity.title.trim()) return

    const activity: Activity = {
      id: `${lead.id}-act-${Date.now()}`,
      type: newActivity.type,
      title: newActivity.title,
      description: newActivity.description,
      date: newActivity.date,
      time: newActivity.time,
      completed: false
    }

    const updatedLead = {
      ...lead,
      activities: [...lead.activities, activity],
      updatedAt: new Date().toISOString().split('T')[0]
    }

    onUpdate(updatedLead)
    
    setNewActivity({
      title: '',
      description: '',
      type: 'note',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5)
    })
  }

  const handleUpdateNotes = () => {
    if (!newNote.trim()) return

    const updatedLead = {
      ...lead,
      notes: newNote,
      updatedAt: new Date().toISOString().split('T')[0]
    }

    onUpdate(updatedLead)
    setNewNote('')
  }

  const toggleActivityComplete = (activityId: string) => {
    const updatedActivities = lead.activities.map(activity =>
      activity.id === activityId
        ? { ...activity, completed: !activity.completed }
        : activity
    )

    const updatedLead = {
      ...lead,
      activities: updatedActivities,
      updatedAt: new Date().toISOString().split('T')[0]
    }

    onUpdate(updatedLead)
  }

  return (
    <div className="h-full flex flex-col bg-slate-800/30">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{lead.companyName}</h2>
            <div className="flex items-center gap-2 text-slate-400">
              <span>{lead.industry}</span>
              <span>•</span>
              <span>{lead.companySize} anställda</span>
              {lead.isImportant && (
                <>
                  <span>•</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={onClose}
            className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/50">
        {[
          { id: 'overview', label: 'Översikt', icon: User },
          { id: 'activities', label: 'Aktiviteter', icon: Calendar },
          { id: 'orders', label: 'Ordrar', icon: DollarSign },
          { id: 'notes', label: 'Anteckningar', icon: MessageSquare }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'activities' | 'orders' | 'notes')}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors
              ${activeTab === tab.id
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-300'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto elegant-scrollbar p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-cyan-400">{formatCurrency(lead.estimatedValue)}</div>
                <div className="text-sm text-slate-400">Uppskattad affär</div>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-slate-200">{lead.activities.length}</div>
                <div className="text-sm text-slate-400">Aktiviteter totalt</div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Primär kontakt</h3>
              <div className="bg-slate-700/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-slate-200">{lead.mainContact.name}</div>
                    <div className="text-slate-400">{lead.mainContact.position}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">{lead.mainContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">{lead.mainContact.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Företagsinformation</h3>
              <div className="bg-slate-700/30 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{lead.website}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{lead.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{lead.industry} • {lead.companySize} anställda</span>
                </div>
                <div className="flex gap-2 mt-4">
                  {lead.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            {/* Add New Activity */}
            <div className="bg-slate-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Lägg till aktivitet</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Aktivitetstitel..."
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-400"
                  />
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as Activity['type'] })}
                    className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200"
                  >
                    <option value="note">Anteckning</option>
                    <option value="call">Samtal</option>
                    <option value="email">E-post</option>
                    <option value="meeting">Möte</option>
                    <option value="task">Uppgift</option>
                  </select>
                </div>
                <textarea
                  placeholder="Beskrivning..."
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-400"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200"
                  />
                  <input
                    type="time"
                    value={newActivity.time}
                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                    className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200"
                  />
                </div>
                <motion.button
                  onClick={handleAddActivity}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg font-medium"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Lägg till aktivitet
                </motion.button>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-3">
              {lead.activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  className="bg-slate-700/30 rounded-xl p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleActivityComplete(activity.id)}
                      className="mt-1"
                    >
                      {activity.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-cyan-400 transition-colors" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{getActivityIcon(activity.type)}</span>
                        <h4 className={`font-medium ${activity.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                          {activity.title}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(activity.date, activity.time)}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-slate-400 text-sm">{activity.description}</p>
                      )}
                      {activity.contactPerson && (
                        <div className="flex items-center gap-2 mt-2">
                          <User className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500">{activity.contactPerson}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {lead.orders.length > 0 ? (
              lead.orders.map((order) => (
                <div key={order.id} className="bg-slate-700/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-200">{order.title}</h4>
                      <p className="text-slate-400">#{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-cyan-400">{formatCurrency(order.amount)}</div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'sent' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-3">{order.description}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.date)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">Inga ordrar eller offerter än</p>
                <motion.button
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Skapa ny offert
                </motion.button>
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Current Notes */}
            {lead.notes && (
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Nuvarande anteckningar</h3>
                <p className="text-slate-300 leading-relaxed">{lead.notes}</p>
              </div>
            )}

            {/* Add New Note */}
            <div className="bg-slate-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Lägg till anteckning</h3>
              <textarea
                placeholder="Skriv dina anteckningar här..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={6}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-400 mb-4"
              />
              <motion.button
                onClick={handleUpdateNotes}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Spara anteckning
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
