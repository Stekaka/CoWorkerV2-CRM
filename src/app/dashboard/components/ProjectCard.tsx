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
    <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500 transform hover:scale-[1.02] shadow-2xl shadow-black/20 hover:shadow-3xl">
      {/* Floating glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-all duration-500 blur-xl`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-black text-white mb-3 leading-tight">{project.title}</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-2xl text-xs font-bold text-gray-200 border border-white/10 shadow-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Participants */}
          <div className="flex -space-x-3 ml-4">
            {project.participants.map((participant, index) => (
              <div key={index} className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 border-2 border-white/20 flex items-center justify-center text-sm font-black text-white shadow-2xl shadow-blue-500/25">
                  {participant.avatar}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 opacity-30 blur-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-300">Progress</span>
            <span className="text-lg font-black text-white">{project.progress}%</span>
          </div>
          <div className="relative w-full h-3 bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-inner">
            <div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${project.color} transition-all duration-1000 ease-out rounded-2xl shadow-lg`}
              style={{ width: `${project.progress}%` }}
            />
            <div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${project.color} opacity-50 blur-sm transition-all duration-1000 ease-out rounded-2xl`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-lime-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-white">{project.completedTasks}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm font-bold text-gray-400">{project.totalTasks - project.completedTasks} kvar</span>
            </div>
          </div>
          
          <div className="text-xs font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-xl">
            {project.totalTasks} totalt
          </div>
        </div>
      </div>
    </div>
  )
}
