'use client'

import { motion, AnimatePresence } from 'framer-motion'
// import { X, Users, Mail, Phone, Calendar, FileText, Plus, Zap, Settings } from 'lucide-react'
import { useState } from 'react'

interface ModalSystemProps {
  activeModal: string | null
  onClose: () => void
}

interface FormData {
  [key: string]: string
}

export default function ModalSystem({ activeModal, onClose }: ModalSystemProps) {
  const [formData, setFormData] = useState<FormData>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (modalType: string) => {
    console.log(`${modalType} submitted:`, formData)
    alert(`${modalType} sparad! (Detta är en demo)`)
    setFormData({})
    onClose()
  }

  const getModalConfig = (modalType: string) => {
    switch (modalType) {
      case 'new-lead':
        return {
          title: 'Ny Lead',
          icon: '👥',
          color: 'from-cyan-500 to-cyan-600',
          fields: [
            { name: 'company', label: 'Företag', type: 'text', required: true, placeholder: 'Acme AB' },
            { name: 'contact', label: 'Kontaktperson', type: 'text', required: true, placeholder: 'Anna Andersson' },
            { name: 'email', label: 'E-post', type: 'email', required: true, placeholder: 'anna@acme.se' },
            { name: 'phone', label: 'Telefon', type: 'tel', placeholder: '+46 70 123 45 67' },
            { name: 'position', label: 'Befattning', type: 'text', placeholder: 'VD' },
            { name: 'industry', label: 'Bransch', type: 'select', options: ['Tech', 'Finans', 'Hälsa', 'Utbildning', 'Retail', 'Annat'] },
            { name: 'source', label: 'Källa', type: 'select', options: ['Hemsida', 'LinkedIn', 'Telefon', 'E-post', 'Referral', 'Mässa'] },
            { name: 'notes', label: 'Anteckningar', type: 'textarea', placeholder: 'Ytterligare information...' }
          ]
        }
      case 'make-call':
        return {
          title: 'Ring Kund',
          icon: '📞',
          color: 'from-emerald-500 to-emerald-600',
          fields: [
            { name: 'contact', label: 'Kontakt', type: 'text', required: true, placeholder: 'Anna Andersson' },
            { name: 'phone', label: 'Telefonnummer', type: 'tel', required: true, placeholder: '+46 70 123 45 67' },
            { name: 'callType', label: 'Typ av samtal', type: 'select', options: ['Försäljningssamtal', 'Uppföljning', 'Support', 'Demonstration', 'Annat'] },
            { name: 'purpose', label: 'Syfte', type: 'text', placeholder: 'Diskutera offert för CRM-system' },
            { name: 'scheduledTime', label: 'Schemalagd tid', type: 'datetime-local' },
            { name: 'notes', label: 'Anteckningar', type: 'textarea', placeholder: 'Samtalsanteckningar...' }
          ]
        }
      case 'send-email':
        return {
          title: 'Skicka E-post',
          icon: '✉️',
          color: 'from-blue-500 to-blue-600',
          fields: [
            { name: 'to', label: 'Till', type: 'email', required: true, placeholder: 'kund@exempel.se' },
            { name: 'cc', label: 'Kopia', type: 'email', placeholder: 'kollega@företag.se' },
            { name: 'subject', label: 'Ämne', type: 'text', required: true, placeholder: 'Angående din förfrågan' },
            { name: 'priority', label: 'Prioritet', type: 'select', options: ['Normal', 'Hög', 'Låg'] },
            { name: 'template', label: 'Mall', type: 'select', options: ['Ingen', 'Välkomstmail', 'Uppföljning', 'Offertmail', 'Påminnelse'] },
            { name: 'message', label: 'Meddelande', type: 'textarea', required: true, placeholder: 'Hej!\n\nTack för ditt intresse...' }
          ]
        }
      case 'schedule-meeting':
        return {
          title: 'Boka Möte',
          icon: '📅',
          color: 'from-violet-500 to-violet-600',
          fields: [
            { name: 'title', label: 'Titel', type: 'text', required: true, placeholder: 'Kundmöte med Acme AB' },
            { name: 'attendees', label: 'Deltagare', type: 'text', placeholder: 'anna@acme.se, erik@företag.se' },
            { name: 'date', label: 'Datum', type: 'date', required: true },
            { name: 'time', label: 'Tid', type: 'time', required: true },
            { name: 'duration', label: 'Varaktighet', type: 'select', options: ['30 min', '1 timme', '1,5 timme', '2 timmar'] },
            { name: 'location', label: 'Plats', type: 'text', placeholder: 'Konferensrum A / Online' },
            { name: 'meetingType', label: 'Typ', type: 'select', options: ['Försäljning', 'Demo', 'Uppföljning', 'Support', 'Internt'] },
            { name: 'agenda', label: 'Agenda', type: 'textarea', placeholder: 'Mötesagenda...' }
          ]
        }
      case 'create-quote':
        return {
          title: 'Skapa Offert',
          icon: '📄',
          color: 'from-orange-500 to-orange-600',
          fields: [
            { name: 'customer', label: 'Kund', type: 'text', required: true, placeholder: 'Acme AB' },
            { name: 'project', label: 'Projekt', type: 'text', required: true, placeholder: 'CRM Implementation' },
            { name: 'amount', label: 'Belopp', type: 'number', required: true, placeholder: '150000' },
            { name: 'currency', label: 'Valuta', type: 'select', options: ['SEK', 'EUR', 'USD'] },
            { name: 'validUntil', label: 'Giltig till', type: 'date' },
            { name: 'paymentTerms', label: 'Betalvillkor', type: 'select', options: ['15 dagar', '30 dagar', '60 dagar'] },
            { name: 'description', label: 'Beskrivning', type: 'textarea', placeholder: 'Detaljerad beskrivning av leveransen...' }
          ]
        }
      case 'add-note':
        return {
          title: 'Ny Anteckning',
          icon: '➕',
          color: 'from-yellow-500 to-yellow-600',
          fields: [
            { name: 'title', label: 'Titel', type: 'text', required: true, placeholder: 'Viktigt att komma ihåg' },
            { name: 'category', label: 'Kategori', type: 'select', options: ['Allmänt', 'Kund', 'Projekt', 'Uppgift', 'Idé'] },
            { name: 'priority', label: 'Prioritet', type: 'select', options: ['Normal', 'Hög', 'Låg'] },
            { name: 'tags', label: 'Taggar', type: 'text', placeholder: 'kund, projekt, viktigt' },
            { name: 'content', label: 'Innehåll', type: 'textarea', required: true, placeholder: 'Skriv din anteckning här...' }
          ]
        }
      case 'automation':
        return {
          title: 'Ny Automatisering',
          icon: '⚡',
          color: 'from-purple-500 to-purple-600',
          fields: [
            { name: 'name', label: 'Namn', type: 'text', required: true, placeholder: 'Automatisk uppföljning' },
            { name: 'trigger', label: 'Utlösare', type: 'select', options: ['Ny lead', 'E-post öppnad', 'Länk klickad', 'Datum passerat', 'Manuell'] },
            { name: 'action', label: 'Åtgärd', type: 'select', options: ['Skicka e-post', 'Skapa uppgift', 'Meddela användare', 'Uppdatera status'] },
            { name: 'delay', label: 'Fördröjning', type: 'select', options: ['Omedelbart', '1 timme', '1 dag', '3 dagar', '1 vecka'] },
            { name: 'description', label: 'Beskrivning', type: 'textarea', placeholder: 'Vad ska automatiseringen göra?' }
          ]
        }
      case 'settings':
        return {
          title: 'Snabbinställningar',
          icon: '⚙️',
          color: 'from-slate-500 to-slate-600',
          fields: [
            { name: 'name', label: 'Namn', type: 'text', placeholder: 'Ditt namn' },
            { name: 'email', label: 'E-post', type: 'email', placeholder: 'din@epost.se' },
            { name: 'phone', label: 'Telefon', type: 'tel', placeholder: '+46 70 123 45 67' },
            { name: 'timezone', label: 'Tidszon', type: 'select', options: ['Europe/Stockholm', 'Europe/Oslo', 'Europe/Copenhagen'] },
            { name: 'language', label: 'Språk', type: 'select', options: ['Svenska', 'English', 'Norsk', 'Dansk'] },
            { name: 'notifications', label: 'Notifikationer', type: 'select', options: ['Alla', 'Viktiga endast', 'Av'] }
          ]
        }
      default:
        return null
    }
  }

  const config = activeModal ? getModalConfig(activeModal) : null
  if (!config) return null

  // Nu använder vi emoji-strängar istället av lucide-react ikoner
  // const Icon = config.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                  <span className="text-2xl">{config.icon}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{config.title}</h2>
                  <p className="text-slate-400 text-sm">Fyll i formuläret nedan</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
              >
                <span className="text-xl">❌</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    >
                      <option value="">Välj...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      rows={4}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700/50 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200"
            >
              Avbryt
            </button>
            <button
              onClick={() => activeModal && handleSubmit(activeModal)}
              className={`flex-1 py-3 px-6 bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-medium rounded-lg transition-all duration-200 shadow-lg`}
            >
              Spara
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
