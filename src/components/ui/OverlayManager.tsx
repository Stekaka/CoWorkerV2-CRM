'use client'

import { useState } from 'react'
import SophisticatedModal from '@/components/ui/SophisticatedModal'
import CalendarDashboard from '@/app/dashboard/components/CalendarDashboard'
import SophisticatedCRM from '@/app/dashboard/components/SophisticatedCRM'
import FinanceDashboard from '@/app/dashboard/components/FinanceDashboard'
import { OverlayProvider } from './OverlayContext'
import { Users, Plus, ShoppingCart, TrendingUp } from 'lucide-react'

interface OverlayManagerProps {
  children: React.ReactNode
}

export type OverlayType = 'calendar-dashboard' | 'crm' | 'finance' | 'leads' | 'email' | 'stats' | 'settings' | 'new-event' | 'new-lead' | 'orders' | 'budget' | null

interface OverlayState {
  type: OverlayType
  data?: Record<string, unknown>
}

export const useOverlay = () => {
  const [overlay, setOverlay] = useState<OverlayState>({ type: null })

  const openOverlay = (type: OverlayType, data?: Record<string, unknown>) => {
    setOverlay({ type, data })
  }

  const closeOverlay = () => {
    setOverlay({ type: null })
  }

  return { overlay, openOverlay, closeOverlay }
}

// Leads Overlay Content  
function LeadsOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <p className="text-slate-400">Hantera alla dina leads och kundkontakter</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">24</div>
          <div className="text-sm text-slate-400">Aktiva leads</div>
        </div>
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">8</div>
          <div className="text-sm text-slate-400">Nya denna vecka</div>
        </div>
      </div>
      
      {/* Recent Leads */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">Senaste leads</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-600/50">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">Acme Corporation</div>
              <div className="text-xs text-slate-400">john@acme.com • Intresserad av demo</div>
            </div>
            <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
              Varm</div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-600/50">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold">
              T
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">TechStart AB</div>
              <div className="text-xs text-slate-400">anna@techstart.se • Begärt offert</div>
            </div>
            <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
              Väntar</div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700/50">
        <button
          onClick={onClose}
          className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-white py-3 px-4 rounded-xl transition-colors"
        >
          Stäng
        </button>
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors">
          Hantera alla leads
        </button>
      </div>
    </div>
  )
}

// New Event Form
function NewEventOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <p className="text-slate-400">Skapa en ny händelse i din kalender</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Titel *</label>
          <input
            type="text"
            className="w-full bg-slate-800/30 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            placeholder="Möte med kund..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Datum *</label>
            <input
              type="date"
              className="w-full bg-slate-800/30 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tid *</label>
            <input
              type="time"
              className="w-full bg-slate-800/30 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Typ</label>
          <select className="w-full bg-slate-800/30 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all">
            <option value="meeting">👥 Möte</option>
            <option value="call">📞 Samtal</option>
            <option value="task">📋 Uppgift</option>
            <option value="reminder">⏰ Påminnelse</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Beskrivning (valfri)</label>
          <textarea
            className="w-full bg-slate-800/30 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
            placeholder="Beskrivning av händelsen..."
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700/50">
        <button
          onClick={onClose}
          className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-white py-3 px-4 rounded-xl transition-colors"
        >
          Avbryt
        </button>
        <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl transition-colors">
          Skapa händelse
        </button>
      </div>
    </div>
  )
}

// Orders Overlay Content
function OrdersOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        <p className="text-slate-400">Översikt av dina kundorders och status</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">475k</div>
          <div className="text-sm text-slate-400">Totalt värde</div>
        </div>
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">4</div>
          <div className="text-sm text-slate-400">Aktiva orders</div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">Senaste orders</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-600/50">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="flex-1">
              <div className="font-medium text-white">ORD-001 • Acme Corp</div>
              <div className="text-xs text-slate-400">150,000 kr • Bekräftad</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-600/50">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="flex-1">
              <div className="font-medium text-white">ORD-002 • TechStart AB</div>
              <div className="text-xs text-slate-400">75,000 kr • Väntar</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700/50">
        <button
          onClick={onClose}
          className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-white py-3 px-4 rounded-xl transition-colors"
        >
          Stäng
        </button>
        <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl transition-colors">
          Hantera orders
        </button>
      </div>
    </div>
  )
}

// Budget Overlay Content
function BudgetOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <p className="text-slate-400">Budget och ekonomisk uppföljning</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">2.0M</div>
          <div className="text-sm text-slate-400">Årsbudget</div>
        </div>
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">+23.7%</div>
          <div className="text-sm text-slate-400">Över budget</div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">Kategorier</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-600/50">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="font-medium text-white">CRM Licenser</div>
                <div className="text-sm font-semibold text-white">225k kr</div>
              </div>
              <div className="text-xs text-slate-400">Budget: 500k kr • 45% använt</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-600/50">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="font-medium text-white">Implementationer</div>
                <div className="text-sm font-semibold text-white">350k kr</div>
              </div>
              <div className="text-xs text-slate-400">Budget: 800k kr • 44% använt</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700/50">
        <button
          onClick={onClose}
          className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-white py-3 px-4 rounded-xl transition-colors"
        >
          Stäng
        </button>
        <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl transition-colors">
          Visa detaljerad budget
        </button>
      </div>
    </div>
  )
}

// Main Overlay Manager Component
export default function OverlayManager({ children }: OverlayManagerProps) {
  const { overlay, openOverlay, closeOverlay } = useOverlay()

  const renderOverlayContent = () => {
    switch (overlay.type) {
      case 'calendar-dashboard':
        return <CalendarDashboard onClose={closeOverlay} />
      case 'crm':
        return <SophisticatedCRM />
      case 'finance':
        return <FinanceDashboard onClose={closeOverlay} />
      case 'leads':
        return <LeadsOverlay onClose={closeOverlay} />
      case 'new-event':
        return <NewEventOverlay onClose={closeOverlay} />
      case 'orders':
        return <OrdersOverlay onClose={closeOverlay} />
      case 'budget':
        return <BudgetOverlay onClose={closeOverlay} />
      default:
        return null
    }
  }

  const getOverlayTitle = () => {
    switch (overlay.type) {
      case 'calendar-dashboard':
        return '📅 Kalender & Uppgifter'
      case 'crm':
        return '👥 CRM System'
      case 'finance':
        return '💰 Ekonomi & Budget'
      case 'leads':
        return '👥 Leads'
      case 'new-event':
        return '✨ Ny händelse'
      case 'orders':
        return '📦 Orders'
      case 'budget':
        return '💰 Budget'
      default:
        return ''
    }
  }

  return (
    <OverlayProvider openOverlay={openOverlay} closeOverlay={closeOverlay}>
      {children}

      {/* Overlay Modal */}
      <SophisticatedModal
        isOpen={overlay.type !== null}
        onClose={closeOverlay}
        title={overlay.type === 'calendar-dashboard' || overlay.type === 'crm' || overlay.type === 'finance' ? '' : getOverlayTitle()}
        maxWidth={overlay.type === 'calendar-dashboard' || overlay.type === 'crm' || overlay.type === 'finance' ? 'full' : 'lg'}
        hideTitle={overlay.type === 'calendar-dashboard' || overlay.type === 'crm' || overlay.type === 'finance'}
      >
        {renderOverlayContent()}
      </SophisticatedModal>
    </OverlayProvider>
  )
}
