'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus, Search, 
  Eye, Edit, Send, Download, Trash2, Save, X, Calendar, Building, 
  User, DollarSign, Package, Calculator, Copy, FileDown
} from 'lucide-react'

interface Quote {
  id: string
  number: string
  client: string
  title: string
  amount: number
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'
  createdDate: string
  expiryDate: string
  items: QuoteItem[]
  notes?: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  taxRate?: number
  discount?: number
}

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

const initialQuotes: Quote[] = [
  {
    id: '1',
    number: 'OFF-2024-001',
    client: 'TechFlow AB',
    title: 'Utveckling av CRM-system',
    amount: 250000,
    status: 'approved',
    createdDate: '2024-01-10',
    expiryDate: '2024-01-25',
    clientEmail: 'kontakt@techflow.se',
    clientPhone: '+46 8 123 456',
    clientAddress: 'Storgatan 1, 111 20 Stockholm',
    taxRate: 25,
    discount: 0,
    items: [
      { id: '1', description: 'Systemdesign och arkitektur', quantity: 40, unitPrice: 1500, total: 60000 },
      { id: '2', description: 'Frontend utveckling', quantity: 80, unitPrice: 1200, total: 96000 },
      { id: '3', description: 'Backend utveckling', quantity: 60, unitPrice: 1400, total: 84000 },
      { id: '4', description: 'Testing och kvalitetssäkring', quantity: 10, unitPrice: 1000, total: 10000 }
    ],
    notes: 'Inkluderar 6 månaders support efter leverans'
  },
  {
    id: '2',
    number: 'OFF-2024-002',
    client: 'Nordic Solutions',
    title: 'Konsultuppdrag Q1',
    amount: 180000,
    status: 'sent',
    createdDate: '2024-01-12',
    expiryDate: '2024-01-27',
    clientEmail: 'info@nordicsolutions.se',
    taxRate: 25,
    items: [
      { id: '1', description: 'Strategisk rådgivning', quantity: 20, unitPrice: 2000, total: 40000 },
      { id: '2', description: 'Projektledning', quantity: 40, unitPrice: 1800, total: 72000 },
      { id: '3', description: 'Teknisk implementation', quantity: 60, unitPrice: 1500, total: 90000 }
    ]
  },
  {
    id: '3',
    number: 'OFF-2024-003',
    client: 'StartupCorp',
    title: 'MVP Utveckling',
    amount: 95000,
    status: 'draft',
    createdDate: '2024-01-14',
    expiryDate: '2024-01-29',
    taxRate: 25,
    items: [
      { id: '1', description: 'Prototyp utveckling', quantity: 30, unitPrice: 1300, total: 39000 },
      { id: '2', description: 'UI/UX Design', quantity: 20, unitPrice: 1400, total: 28000 },
      { id: '3', description: 'Grundläggande funktionalitet', quantity: 40, unitPrice: 1200, total: 48000 }
    ]
  }
]

const getStatusColor = (status: Quote['status']) => {
  switch (status) {
    case 'draft': return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
    case 'sent': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/30'
    case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/30'
    case 'expired': return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
  }
}

const getStatusText = (status: Quote['status']) => {
  switch (status) {
    case 'draft': return 'Utkast'
    case 'sent': return 'Skickad'
    case 'approved': return 'Godkänd'
    case 'rejected': return 'Avvisad'
    case 'expired': return 'Utgången'
  }
}

const getStatusIcon = (status: Quote['status']) => {
  switch (status) {
    case 'draft': return <Edit className="w-4 h-4" />
    case 'sent': return <Clock className="w-4 h-4" />
    case 'approved': return <CheckCircle className="w-4 h-4" />
    case 'rejected': return <XCircle className="w-4 h-4" />
    case 'expired': return <AlertCircle className="w-4 h-4" />
  }
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)

  // New quote form state
  const [newQuote, setNewQuote] = useState<Partial<Quote>>({
    client: '',
    title: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    notes: '',
    taxRate: 25,
    discount: 0,
    items: [{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }]
  })

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.number.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const approvedValue = quotes.filter(q => q.status === 'approved').reduce((sum, q) => sum + q.amount, 0)
  const pendingValue = quotes.filter(q => q.status === 'sent').reduce((sum, q) => sum + q.amount, 0)
  const winRate = quotes.length > 0 ? (quotes.filter(q => q.status === 'approved').length / quotes.length) * 100 : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', { 
      style: 'currency', 
      currency: 'SEK',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE')
  }

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0
  }

  const generateQuoteNumber = () => {
    const year = new Date().getFullYear()
    const nextNumber = quotes.length + 1
    return `OFF-${year}-${nextNumber.toString().padStart(3, '0')}`
  }

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const calculateSubtotal = (items: QuoteItem[]) => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTotal = (items: QuoteItem[], discount = 0, taxRate = 25) => {
    const subtotal = calculateSubtotal(items)
    const discountAmount = subtotal * (discount / 100)
    const afterDiscount = subtotal - discountAmount
    const taxAmount = afterDiscount * (taxRate / 100)
    return afterDiscount + taxAmount
  }

  const handleCreateQuote = () => {
    setNewQuote({
      client: '',
      title: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      notes: '',
      taxRate: 25,
      discount: 0,
      items: [{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }]
    })
    setIsCreating(true)
  }

  const handleSaveQuote = () => {
    if (!newQuote.client || !newQuote.title || !newQuote.items?.length) return

    const items = newQuote.items.map(item => ({
      ...item,
      total: calculateItemTotal(item.quantity, item.unitPrice)
    }))

    const amount = calculateTotal(items, newQuote.discount, newQuote.taxRate)
    
    const quote: Quote = {
      id: Date.now().toString(),
      number: generateQuoteNumber(),
      client: newQuote.client,
      title: newQuote.title,
      amount,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      items,
      notes: newQuote.notes,
      clientEmail: newQuote.clientEmail,
      clientPhone: newQuote.clientPhone,
      clientAddress: newQuote.clientAddress,
      taxRate: newQuote.taxRate || 25,
      discount: newQuote.discount || 0
    }

    setQuotes([quote, ...quotes])
    setIsCreating(false)
  }

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote({ ...quote })
    setIsEditing(true)
  }

  const handleUpdateQuote = () => {
    if (!editingQuote) return

    const items = editingQuote.items.map(item => ({
      ...item,
      total: calculateItemTotal(item.quantity, item.unitPrice)
    }))

    const amount = calculateTotal(items, editingQuote.discount, editingQuote.taxRate)

    const updatedQuote = {
      ...editingQuote,
      items,
      amount
    }

    setQuotes(quotes.map(q => q.id === editingQuote.id ? updatedQuote : q))
    setIsEditing(false)
    setEditingQuote(null)
  }

  const handleSendQuote = (quoteId: string) => {
    setQuotes(quotes.map(q => 
      q.id === quoteId ? { ...q, status: 'sent' as const } : q
    ))
  }

  const handleDownloadPDF = (quote: Quote) => {
    // Simulate PDF generation
    const pdfContent = `
OFFERT ${quote.number}

Klient: ${quote.client}
Titel: ${quote.title}
Datum: ${formatDate(quote.createdDate)}
Utgår: ${formatDate(quote.expiryDate)}

ARTIKLAR:
${quote.items.map(item => 
  `${item.description} - ${item.quantity} st × ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.total)}`
).join('\n')}

TOTAL: ${formatCurrency(quote.amount)}

${quote.notes ? `\nAnteckningar:\n${quote.notes}` : ''}
    `.trim()

    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${quote.number}-${quote.client.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDuplicateQuote = (quote: Quote) => {
    const duplicatedQuote: Quote = {
      ...quote,
      id: Date.now().toString(),
      number: generateQuoteNumber(),
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    setQuotes([duplicatedQuote, ...quotes])
  }

  const addNewItem = (items: QuoteItem[], setItems: (items: QuoteItem[]) => void) => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    setItems([...items, newItem])
  }

  const updateItem = (items: QuoteItem[], itemId: string, field: keyof QuoteItem, value: any, setItems: (items: QuoteItem[]) => void) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = calculateItemTotal(updated.quantity, updated.unitPrice)
        }
        return updated
      }
      return item
    })
    setItems(updatedItems)
  }

  const removeItem = (items: QuoteItem[], itemId: string, setItems: (items: QuoteItem[]) => void) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== itemId))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 mobile-padding ios-height-fix">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 safe-area-top">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-2">Offerter & Prisförslag</h1>
            <p className="text-sm md:text-base text-slate-400">Hantera dina offerter och spåra försäljningspipeline</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateQuote}
            className="mobile-button-large w-full md:w-auto px-4 md:px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-600/25 transition-all duration-300 text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
            Ny Offert
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              <span className="text-lg md:text-2xl font-bold text-white">{quotes.length}</span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Totala Offerter</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              <span className="text-sm md:text-2xl font-bold text-white">{formatCurrency(approvedValue)}</span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Godkända Offerter</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
              <span className="text-sm md:text-2xl font-bold text-white">{formatCurrency(pendingValue)}</span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Väntar Svar</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              <span className="text-lg md:text-2xl font-bold text-white">{winRate.toFixed(0)}%</span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Vinstfrekvens</p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                            <input
                type="text"
                placeholder="Sök offerter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-input w-full pl-9 md:pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-base"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mobile-input px-3 md:px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/50 text-base"
            >
              <option value="all">Alla Status</option>
              <option value="draft">Utkast</option>
              <option value="sent">Skickad</option>
              <option value="approved">Godkänd</option>
              <option value="rejected">Avvisad</option>
              <option value="expired">Utgången</option>
            </select>
          </div>
        </div>

        {/* Quotes List */}
        <div className="space-y-3 md:space-y-4">
          {filteredQuotes.map((quote, index) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
                <div className="flex-1 w-full md:w-auto">
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 mb-2">
                    <h3 className="text-base md:text-lg font-semibold text-white">{quote.title}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(quote.status)}`}>
                        {getStatusIcon(quote.status)}
                        <span>{getStatusText(quote.status)}</span>
                      </span>
                      {isExpiringSoon(quote.expiryDate) && quote.status === 'sent' && (
                        <span className="px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full text-xs flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Går ut snart</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-400 mb-2">
                    <span>{quote.number}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{quote.client}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden sm:inline">Skapad: {formatDate(quote.createdDate)}</span>
                    <span className="hidden sm:inline md:inline">•</span>
                    <span>Utgår: {formatDate(quote.expiryDate)}</span>
                  </div>
                  
                  <div className="text-xl md:text-2xl font-bold text-white mb-2">
                    {formatCurrency(quote.amount)}
                  </div>
                  
                  {quote.notes && (
                    <p className="text-xs md:text-sm text-slate-400 italic">{quote.notes}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 md:space-x-2 w-full md:w-auto justify-end">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedQuote(quote)}
                    className="mobile-button p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Visa detaljer"
                  >
                    <Eye className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditQuote(quote)}
                    className="mobile-button p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Redigera"
                  >
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDuplicateQuote(quote)}
                    className="mobile-button p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Duplicera"
                  >
                    <Copy className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>
                  
                  {quote.status === 'draft' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSendQuote(quote.id)}
                      className="mobile-button p-2 text-slate-400 hover:text-green-400 transition-colors"
                      title="Skicka"
                    >
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDownloadPDF(quote)}
                    className="mobile-button p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Ladda ner PDF"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">Inga offerter hittades</h3>
            <p className="text-slate-500">Försök med en annan sökning eller skapa en ny offert</p>
          </div>
        )}

        {/* Create/Edit Quote Modal */}
        <AnimatePresence>
          {(isCreating || isEditing) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setIsCreating(false)
                setIsEditing(false)
                setEditingQuote(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {isCreating ? 'Skapa Ny Offert' : 'Redigera Offert'}
                    </h2>
                    <button
                      onClick={() => {
                        setIsCreating(false)
                        setIsEditing(false)
                        setEditingQuote(null)
                      }}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Grundinformation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Klient *</label>
                        <input
                          type="text"
                          value={isCreating ? newQuote.client || '' : editingQuote?.client || ''}
                          onChange={(e) => isCreating 
                            ? setNewQuote({...newQuote, client: e.target.value})
                            : setEditingQuote(editingQuote ? {...editingQuote, client: e.target.value} : null)
                          }
                          className="w-full bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 text-white"
                          placeholder="Företagsnamn"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Titel *</label>
                        <input
                          type="text"
                          value={isCreating ? newQuote.title || '' : editingQuote?.title || ''}
                          onChange={(e) => isCreating
                            ? setNewQuote({...newQuote, title: e.target.value})
                            : setEditingQuote(editingQuote ? {...editingQuote, title: e.target.value} : null)
                          }
                          className="w-full bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 text-white"
                          placeholder="Projektnamn eller beskrivning"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Email</label>
                        <input
                          type="email"
                          value={isCreating ? newQuote.clientEmail || '' : editingQuote?.clientEmail || ''}
                          onChange={(e) => isCreating
                            ? setNewQuote({...newQuote, clientEmail: e.target.value})
                            : setEditingQuote(editingQuote ? {...editingQuote, clientEmail: e.target.value} : null)
                          }
                          className="w-full bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 text-white"
                          placeholder="kontakt@företag.se"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Telefon</label>
                        <input
                          type="tel"
                          value={isCreating ? newQuote.clientPhone || '' : editingQuote?.clientPhone || ''}
                          onChange={(e) => isCreating
                            ? setNewQuote({...newQuote, clientPhone: e.target.value})
                            : setEditingQuote(editingQuote ? {...editingQuote, clientPhone: e.target.value} : null)
                          }
                          className="w-full bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 text-white"
                          placeholder="+46 8 123 456"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Artiklar
                    </h3>
                    <div className="space-y-3">
                      {(isCreating ? newQuote.items || [] : editingQuote?.items || []).map((item, index) => (
                        <div key={item.id} className="bg-slate-800/30 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="md:col-span-2">
                              <label className="block text-slate-400 text-sm mb-2">Beskrivning</label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => isCreating
                                  ? updateItem(newQuote.items || [], item.id, 'description', e.target.value, (items) => setNewQuote({...newQuote, items}))
                                  : updateItem(editingQuote?.items || [], item.id, 'description', e.target.value, (items) => setEditingQuote(editingQuote ? {...editingQuote, items} : null))
                                }
                                className="w-full bg-slate-700/50 border border-slate-600/30 rounded-lg p-2 text-white text-sm"
                                placeholder="Beskrivning av tjänst/produkt"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 text-sm mb-2">Antal</label>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => isCreating
                                  ? updateItem(newQuote.items || [], item.id, 'quantity', parseInt(e.target.value) || 0, (items) => setNewQuote({...newQuote, items}))
                                  : updateItem(editingQuote?.items || [], item.id, 'quantity', parseInt(e.target.value) || 0, (items) => setEditingQuote(editingQuote ? {...editingQuote, items} : null))
                                }
                                className="w-full bg-slate-700/50 border border-slate-600/30 rounded-lg p-2 text-white text-sm"
                                min="1"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 text-sm mb-2">Pris/st</label>
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => isCreating
                                  ? updateItem(newQuote.items || [], item.id, 'unitPrice', parseInt(e.target.value) || 0, (items) => setNewQuote({...newQuote, items}))
                                  : updateItem(editingQuote?.items || [], item.id, 'unitPrice', parseInt(e.target.value) || 0, (items) => setEditingQuote(editingQuote ? {...editingQuote, items} : null))
                                }
                                className="w-full bg-slate-700/50 border border-slate-600/30 rounded-lg p-2 text-white text-sm"
                                min="0"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-white font-medium">
                                {formatCurrency(item.total)}
                              </div>
                              {(isCreating ? newQuote.items?.length || 0 : editingQuote?.items?.length || 0) > 1 && (
                                <button
                                  onClick={() => isCreating
                                    ? removeItem(newQuote.items || [], item.id, (items) => setNewQuote({...newQuote, items}))
                                    : removeItem(editingQuote?.items || [], item.id, (items) => setEditingQuote(editingQuote ? {...editingQuote, items} : null))
                                  }
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => isCreating
                          ? addNewItem(newQuote.items || [], (items) => setNewQuote({...newQuote, items}))
                          : addNewItem(editingQuote?.items || [], (items) => setEditingQuote(editingQuote ? {...editingQuote, items} : null))
                        }
                        className="w-full py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors"
                      >
                        + Lägg till artikel
                      </button>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Prissättning
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Rabatt (%)</label>
                        <input
                          type="number"
                          value={isCreating ? newQuote.discount || 0 : editingQuote?.discount || 0}
                          onChange={(e) => isCreating
                            ? setNewQuote({...newQuote, discount: parseInt(e.target.value) || 0})
                            : setEditingQuote(editingQuote ? {...editingQuote, discount: parseInt(e.target.value) || 0} : null)
                          }
                          className="w-full bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 text-white"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Moms (%)</label>
                        <input
                          type="number"
                          value={isCreating ? newQuote.taxRate || 25 : editingQuote?.taxRate || 25}
                          onChange={(e) => isCreating
                            ? setNewQuote({...newQuote, taxRate: parseInt(e.target.value) || 25})
                            : setEditingQuote(editingQuote ? {...editingQuote, taxRate: parseInt(e.target.value) || 25} : null)
                          }
                          className="w-full bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 text-white"
                          min="0"
                          max="50"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Total</label>
                        <div className="text-2xl font-bold text-white p-3">
                          {formatCurrency(calculateTotal(
                            isCreating ? newQuote.items || [] : editingQuote?.items || [],
                            isCreating ? newQuote.discount : editingQuote?.discount,
                            isCreating ? newQuote.taxRate : editingQuote?.taxRate
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Anteckningar</label>
                    <textarea
                      value={isCreating ? newQuote.notes || '' : editingQuote?.notes || ''}
                      onChange={(e) => isCreating
                        ? setNewQuote({...newQuote, notes: e.target.value})
                        : setEditingQuote(editingQuote ? {...editingQuote, notes: e.target.value} : null)
                      }
                      className="w-full bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 text-white"
                      rows={3}
                      placeholder="Eventuella anteckningar eller villkor..."
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-slate-700 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setIsCreating(false)
                      setIsEditing(false)
                      setEditingQuote(null)
                    }}
                    className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    Avbryt
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={isCreating ? handleSaveQuote : handleUpdateQuote}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-600/25 transition-all duration-300 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isCreating ? 'Skapa Offert' : 'Spara Ändringar'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quote Detail Modal */}
        <AnimatePresence>
          {selectedQuote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedQuote(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedQuote.title}</h2>
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Offertnummer:</span>
                      <p className="text-white font-medium">{selectedQuote.number}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Klient:</span>
                      <p className="text-white font-medium">{selectedQuote.client}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Skapad:</span>
                      <p className="text-white font-medium">{formatDate(selectedQuote.createdDate)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Utgår:</span>
                      <p className="text-white font-medium">{formatDate(selectedQuote.expiryDate)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Artiklar</h3>
                  <div className="space-y-2">
                    {selectedQuote.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.description}</p>
                          <p className="text-slate-400 text-sm">
                            {item.quantity} st × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <div className="text-white font-semibold">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(selectedQuote.amount)}
                    </span>
                  </div>
                </div>
                
                {selectedQuote.notes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Anteckningar</h3>
                    <p className="text-slate-400 italic">{selectedQuote.notes}</p>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedQuote(null)
                      handleEditQuote(selectedQuote)
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-600/25 transition-all duration-300"
                  >
                    <Edit className="w-5 h-5 inline mr-2" />
                    Redigera
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownloadPDF(selectedQuote)}
                    className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
                  >
                    <Download className="w-5 h-5 inline mr-2" />
                    Ladda ner PDF
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
