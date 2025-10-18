import { useState, useEffect } from 'react'
import { DashboardStats } from '@/types'
import { dashboardApi } from '@/lib/api'
import { useApiError } from './useApiError'

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { error, executeWithErrorHandling } = useApiError()

  const fetchStats = async () => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        const data = await dashboardApi.getStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        throw error
      } finally {
        setLoading(false)
      }
    }, 'Dashboard Statistics')
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const refreshStats = () => {
    fetchStats()
  }

  return {
    stats,
    loading,
    error,
    refreshStats
  }
}
