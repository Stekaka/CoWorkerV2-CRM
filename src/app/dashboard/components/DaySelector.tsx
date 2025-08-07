'use client'

interface DaySelectorProps {
  days: string[]
  selectedDay: string
  onDaySelect: (day: string) => void
}

export default function DaySelector({ days, selectedDay, onDaySelect }: DaySelectorProps) {
  return (
    <div className="mb-10">
      <h3 className="text-xl font-black text-white mb-6">Välj dag</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onDaySelect(day)}
            className={`
              relative flex-shrink-0 px-8 py-4 rounded-3xl font-black transition-all duration-500 transform hover:scale-110 shadow-2xl
              ${selectedDay === day 
                ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-white shadow-cyan-500/30 shadow-2xl border-2 border-white/20' 
                : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-300 hover:bg-white/15 hover:text-white hover:border-white/20 shadow-black/20'
              }
            `}
          >
            <span className="relative z-10">{day}</span>
            {/* Glow effect för vald dag */}
            {selectedDay === day && (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl opacity-50 blur-xl animate-pulse" />
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse shadow-lg shadow-white/50" />
              </>
            )}
            {/* Hover glow för andra dagar */}
            {selectedDay !== day && (
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
