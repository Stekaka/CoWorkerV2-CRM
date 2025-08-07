'use client'

import { X } from 'lucide-react'

interface FinanceDashboardProps {
  onClose: () => void
}

export default function FinanceDashboard({ onClose }: FinanceDashboardProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Ekonomi Dashboard</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Ekonomi Dashboard
            </h3>
            <p className="text-gray-500">
              Här kan du hantera din ekonomi och finansiella data.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Inga mockdata - redo för din egen data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
