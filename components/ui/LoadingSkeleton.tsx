'use client'

import React from 'react'

interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export function LoadingSkeleton({ lines = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded loading-skeleton"
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
