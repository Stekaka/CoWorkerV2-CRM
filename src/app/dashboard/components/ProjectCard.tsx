'use client'

import { CheckCircle, Clock } from 'lucide-react'

interface Participant {
  name: string
  avatar: string
}

interface Project {
  id: string
  title: string
  progress: number
  totalTasks: number
  completedTasks: number
  tags: string[]
  color: string
  participants: Participant[]
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-gray-200 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Participants */}
        <div className="flex -space-x-2">
          {project.participants.map((participant, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-lg"
            >
              {participant.avatar}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Progress</span>
          <span className="text-sm font-bold text-white">{project.progress}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className={`h-full bg-gradient-to-r ${project.color} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{project.completedTasks}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{project.totalTasks - project.completedTasks} kvar</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          {project.totalTasks} tasks totalt
        </div>
      </div>

      {/* Floating glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-0 hover:opacity-10 rounded-3xl transition-opacity duration-300 pointer-events-none`} />
    </div>
  )
}
