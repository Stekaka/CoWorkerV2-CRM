'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'title' | 'avatar' | 'button' | 'card' | 'custom'
  count?: number
}

export function Skeleton({ className, variant = 'custom', count = 1 }: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'skeleton skeleton-text'
      case 'title':
        return 'skeleton skeleton-title'
      case 'avatar':
        return 'skeleton skeleton-avatar'
      case 'button':
        return 'skeleton skeleton-button'
      case 'card':
        return 'skeleton h-32 rounded-2xl'
      default:
        return 'skeleton'
    }
  }

  const skeletonClasses = cn(getVariantClasses(), className)

  if (count === 1) {
    return <div className={skeletonClasses} />
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClasses} />
      ))}
    </div>
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('mobile-card p-6 space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="title" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-5/6" />
        <Skeleton variant="text" className="w-4/6" />
      </div>
      <div className="flex space-x-2">
        <Skeleton variant="button" className="w-20" />
        <Skeleton variant="button" className="w-16" />
      </div>
    </div>
  )
}

interface LoadingListProps {
  count?: number
  className?: string
}

export function LoadingList({ count = 3, className }: LoadingListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  )
}

interface LoadingStatsProps {
  className?: string
}

export function LoadingStats({ className }: LoadingStatsProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-4 gap-6', className)}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="mobile-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton variant="title" className="w-16" />
          </div>
          <Skeleton variant="text" className="w-24" />
        </div>
      ))}
    </div>
  )
}

interface LoadingButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export function LoadingButton({ className, size = 'md', children }: LoadingButtonProps) {
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  }

  return (
    <button 
      disabled
      className={cn(
        'mobile-button bg-gradient-to-r from-cyan-600 to-blue-600 text-white',
        'opacity-75 cursor-not-allowed flex items-center justify-center space-x-2',
        sizeClasses[size],
        className
      )}
    >
      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      {children && <span>{children}</span>}
    </button>
  )
}

interface PulseLoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PulseLoader({ className, size = 'md' }: PulseLoaderProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse',
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}
