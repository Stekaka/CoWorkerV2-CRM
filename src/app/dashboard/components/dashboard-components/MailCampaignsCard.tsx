'use client'

import { motion } from 'framer-motion'
import { Mail, Send, Eye, MousePointer, TrendingUp, Plus } from 'lucide-react'

export default function MailCampaignsCard() {
  const campaigns = [
    {
      id: 1,
      name: 'Q1 Produktlansering',
      status: 'active',
      sent: 2847,
      opened: 1423,
      clicked: 284,
      replies: 45,
      sentDate: '2024-01-10',
      subject: 'Revolutionerande lösningar för ditt företag'
    },
    {
      id: 2,
      name: 'Uppföljning Prospects',
      status: 'scheduled',
      sent: 0,
      opened: 0,
      clicked: 0,
      replies: 0,
      sentDate: '2024-01-15',
      subject: 'Har du funderat på vår lösning?'
    },
    {
      id: 3,
      name: 'Newsletter December',
      status: 'completed',
      sent: 5234,
      opened: 3140,
      clicked: 628,
      replies: 89,
      sentDate: '2023-12-28',
      subject: 'Årssammanfattning och framtidsplaner'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-400/10'
      case 'scheduled': return 'text-cyan-400 bg-cyan-400/10'
      case 'completed': return 'text-slate-400 bg-slate-400/10'
      case 'draft': return 'text-amber-400 bg-amber-400/10'
      default: return 'text-slate-400 bg-slate-400/10'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv'
      case 'scheduled': return 'Schemalagd'
      case 'completed': return 'Slutförd'
      case 'draft': return 'Utkast'
      default: return 'Okänd'
    }
  }

  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.sent, 0)
  const totalOpened = campaigns.reduce((sum, campaign) => sum + campaign.opened, 0)
  const totalClicked = campaigns.reduce((sum, campaign) => sum + campaign.clicked, 0)
  const totalReplies = campaigns.reduce((sum, campaign) => sum + campaign.replies, 0)

  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0'
  const clickRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : '0'
  const replyRate = totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : '0'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-slate-900/50 backdrop-blur border border-slate-800/50 rounded-2xl p-4 sm:p-6 hover:bg-slate-800/30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 truncate">Mail Kampanjer</h2>
            <p className="text-slate-400 text-sm hidden sm:block">E-postmarknadsföring och uppföljning</p>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="text-center p-2 sm:p-3 bg-slate-800/30 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Send className="w-3 h-3 text-cyan-400" />
            <span className="text-xs text-slate-400 hidden sm:inline">Skickade</span>
          </div>
          <div className="text-sm sm:text-lg font-bold text-slate-100">{totalSent.toLocaleString()}</div>
          <div className="text-xs text-slate-400 sm:hidden">Skickade</div>
        </div>
        
        <div className="text-center p-2 sm:p-3 bg-slate-800/30 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Eye className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-slate-400 hidden sm:inline">Öppnade</span>
          </div>
          <div className="text-sm sm:text-lg font-bold text-emerald-400">{openRate}%</div>
          <div className="text-xs text-slate-400 sm:hidden">Öppnade</div>
        </div>
        
        <div className="text-center p-2 sm:p-3 bg-slate-800/30 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MousePointer className="w-3 h-3 text-violet-400" />
            <span className="text-xs text-slate-400 hidden sm:inline">Klickade</span>
          </div>
          <div className="text-sm sm:text-lg font-bold text-violet-400">{clickRate}%</div>
          <div className="text-xs text-slate-400 sm:hidden">Klickade</div>
        </div>
        
        <div className="text-center p-2 sm:p-3 bg-slate-800/30 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span className="text-xs text-slate-400 hidden sm:inline">Svar</span>
          </div>
          <div className="text-sm sm:text-lg font-bold text-amber-400">{replyRate}%</div>
          <div className="text-xs text-slate-400 sm:hidden">Svar</div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300">Aktiva Kampanjer</h3>
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
            className="p-3 sm:p-4 bg-slate-800/40 rounded-lg border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-700/40 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-100 text-sm truncate">{campaign.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(campaign.status)}`}>
                    {getStatusText(campaign.status)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{campaign.subject}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(campaign.sentDate).toLocaleDateString('sv-SE')}
                </p>
              </div>
            </div>
            
            {campaign.sent > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                <div className="text-center">
                  <div className="text-xs font-medium text-slate-100">{campaign.sent}</div>
                  <div className="text-xs text-slate-500">Skickade</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-emerald-400">{campaign.opened}</div>
                  <div className="text-xs text-slate-500">Öppnade</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-violet-400">{campaign.clicked}</div>
                  <div className="text-xs text-slate-500">Klick</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-amber-400">{campaign.replies}</div>
                  <div className="text-xs text-slate-500">Svar</div>
                </div>
              </div>
            )}
            
            {campaign.status === 'scheduled' && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">Schemalagt för {new Date(campaign.sentDate).toLocaleDateString('sv-SE')}</span>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  Redigera
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-slate-800/50">
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 text-sm flex items-center justify-center gap-2 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Ny kampanj
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 text-sm flex items-center justify-center gap-2 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
          >
            <TrendingUp className="w-4 h-4" />
            Analytik
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
