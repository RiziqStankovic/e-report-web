'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ErrorHandler } from '@/components/ErrorHandler'
import { useApiError } from '@/hooks/useApiError'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClockIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsData {
  summary: {
    totalReports: number
    pendingReports: number
    processedReports: number
    completedReports: number
    averageResolutionTime: number
  }
  reportsByCategory: Array<{
    category: string
    count: number
    percentage: number
  }>
  reportsByStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
  reportsByMonth: Array<{
    month: string
    count: number
  }>
  reportsByRole: Array<{
    role: string
    count: number
  }>
  resolutionTimeTrend: Array<{
    date: string
    averageTime: number
  }>
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

export default function AnalyticsPage() {
  const { user, isAuthenticated } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30') // days
  const { error, executeWithErrorHandling } = useApiError()

  const fetchAnalytics = async () => {
    await executeWithErrorHandling(async () => {
      setLoading(true)
      try {
        // No fallback data - use empty object
        setAnalyticsData({
          summary: {
            totalReports: 0,
            pendingReports: 0,
            processedReports: 0,
            completedReports: 0,
            averageResolutionTime: 0
          },
          reportsByCategory: [],
          reportsByStatus: [],
          reportsByMonth: [],
          reportsByRole: [],
          resolutionTimeTrend: []
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }, 'Analytics')
  }

  const exportData = () => {
    if (!analyticsData) return
    
    const csvData = [
      ['Kategori', 'Jumlah', 'Persentase'],
      ...analyticsData.reportsByCategory.map(item => [
        item.category,
        item.count.toString(),
        `${item.percentage}%`
      ])
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics-data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isAuthenticated || user?.role === 'ketua_kelas') {
    return null
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!analyticsData) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-500">Gagal memuat data analitik</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <ErrorHandler error={error} onRetry={fetchAnalytics} />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analitik & Laporan</h1>
            <p className="text-gray-600">
              Analisis data dan performa sistem laporan
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">7 Hari Terakhir</option>
              <option value="30">30 Hari Terakhir</option>
              <option value="90">90 Hari Terakhir</option>
              <option value="365">1 Tahun Terakhir</option>
            </select>
            
            <Button
              variant="outline"
              onClick={exportData}
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Laporan</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.totalReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.pendingReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Diproses</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.processedReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.completedReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rata-rata Waktu</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.averageResolutionTime}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.reportsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.reportsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reports by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan per Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.reportsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reports Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Trend Laporan per Bulan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.reportsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resolution Time Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Trend Waktu Penyelesaian</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.resolutionTimeTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="averageTime" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports by Category Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detail per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Kategori</th>
                      <th className="text-right py-2">Jumlah</th>
                      <th className="text-right py-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.reportsByCategory.map((item, index) => (
                      <tr key={item.category} className="border-b">
                        <td className="py-2 flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          {item.category}
                        </td>
                        <td className="text-right py-2">{item.count}</td>
                        <td className="text-right py-2">{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Reports by Role Table */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan per Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Role</th>
                      <th className="text-right py-2">Jumlah Laporan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.reportsByRole.map((item) => (
                      <tr key={item.role} className="border-b">
                        <td className="py-2">{item.role}</td>
                        <td className="text-right py-2">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}