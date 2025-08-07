'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { StickyNote, Save } from 'lucide-react'

export default function NewNotePage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    tags: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New note:', formData)
    alert('Anteckning sparad! (Detta är en demo)')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl">
              <StickyNote className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Ny Anteckning</h1>
              <p className="text-slate-400">Skapa en ny anteckning eller memo</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Titel *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                placeholder="Anteckningens titel"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="general">Allmänt</option>
                  <option value="meeting">Möte</option>
                  <option value="idea">Idé</option>
                  <option value="reminder">Påminnelse</option>
                  <option value="project">Projekt</option>
                  <option value="client">Kund</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Prioritet
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="low">Låg</option>
                  <option value="medium">Medium</option>
                  <option value="high">Hög</option>
                  <option value="urgent">Brådskande</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Taggar
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                placeholder="Taggar separerade med kommatecken (t.ex. projekt, viktigt, uppföljning)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Innehåll *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={10}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                placeholder="Skriv din anteckning här..."
              />
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Tips:</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Använd beskrivande titlar för enkelt sökande</li>
                <li>• Lägg till relevanta taggar för bättre organisation</li>
                <li>• Markera viktiga anteckningar med hög prioritet</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Spara Anteckning
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
