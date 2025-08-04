'use client'

interface DaySelectorProps {
  days: string[]
  selectedDay: string
  onDaySelect: (day: string) => void
}

export default function DaySelector({ days, selectedDay, onDaySelect }: DaySelectorProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Välj dag</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onDaySelect(day)}
            className={`
              flex-shrink-0 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105
              ${selectedDay === day 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20 hover:text-white'
              }
            `}
          >
            {day}
            {/* Dagens datum indicator */}
            {selectedDay === day && (
              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
