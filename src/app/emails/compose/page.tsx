'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Paperclip } from 'lucide-react'

export default function ComposeEmailPage() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
    priority: 'normal'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New email:', formData)
    alert('E-post skickat! (Detta är en demo)')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Komponera E-post</h1>
              <p className="text-slate-400">Skicka ett e-postmeddelande</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Till *
              </label>
              <input
                type="email"
                required
                value={formData.to}
                onChange={(e) => setFormData({...formData, to: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="mottagare@exempel.se"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ämne *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Ämnesrad för e-posten"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Prioritet
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Låg</option>
                <option value="normal">Normal</option>
                <option value="high">Hög</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Meddelande *
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={10}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Skriv ditt meddelande här..."
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors duration-200"
              >
                <Paperclip className="h-4 w-4" />
                Bifoga fil
              </button>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex items-center gap-2 flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                <Send className="h-4 w-4" />
                Skicka E-post
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-medium rounded-lg transition-colors duration-200"
              >
                Avbryt
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
