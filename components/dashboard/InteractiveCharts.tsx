'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ChartBarIcon,
  ChartPieIcon,
  ChartBarIcon as ChartLineIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'

interface ChartData {
  name: string
  value: number
  [key: string]: unknown
}

interface InteractiveChartsProps {
  data: {
    reportsByCategory: ChartData[]
    reportsByStatus: ChartData[]
    reportsByMonth: ChartData[]
    reportsByRole: ChartData[]
    resolutionTimeTrend: ChartData[]
  }
  className?: string
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

export function InteractiveCharts({ data, className }: InteractiveChartsProps) {
  const [activeChart, setActiveChart] = useState<string>('category')
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line' | 'area'>('bar')
  const [animated, setAnimated] = useState(true)

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: ChartBarIcon },
    { id: 'pie', label: 'Pie Chart', icon: ChartPieIcon },
    { id: 'line', label: 'Line Chart', icon: ChartLineIcon },
    { id: 'area', label: 'Area Chart', icon: TableCellsIcon }
  ]

  const chartData = {
    category: data.reportsByCategory,
    status: data.reportsByStatus,
    month: data.reportsByMonth,
    role: data.reportsByRole,
    trend: data.resolutionTimeTrend
  }

  const renderChart = () => {
    const currentData = chartData[activeChart as keyof typeof chartData]
    
    if (!currentData || currentData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Tidak ada data untuk ditampilkan</p>
          </div>
        </div>
      )
    }

    const commonProps = {
      data: currentData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    }

    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={animated ? 800 : 0}
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                animationBegin={0}
                animationDuration={animated ? 800 : 0}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.3}
                animationBegin={0}
                animationDuration={animated ? 800 : 0}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="value" 
                fill="#3B82F6"
                animationBegin={0}
                animationDuration={animated ? 800 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  const getChartTitle = () => {
    switch (activeChart) {
      case 'category':
        return 'Laporan per Kategori'
      case 'status':
        return 'Laporan per Status'
      case 'month':
        return 'Trend Laporan per Bulan'
      case 'role':
        return 'Laporan per Role'
      case 'trend':
        return 'Trend Waktu Penyelesaian'
      default:
        return 'Grafik Data'
    }
  }

  const getTotalValue = () => {
    const currentData = chartData[activeChart as keyof typeof chartData]
    return currentData?.reduce((sum, item) => sum + item.value, 0) || 0
  }

  const getAverageValue = () => {
    const currentData = chartData[activeChart as keyof typeof chartData]
    if (!currentData || currentData.length === 0) return 0
    return (getTotalValue() / currentData.length).toFixed(1)
  }

  const getMaxValue = () => {
    const currentData = chartData[activeChart as keyof typeof chartData]
    if (!currentData || currentData.length === 0) return 0
    return Math.max(...currentData.map(item => item.value))
  }

  const getMinValue = () => {
    const currentData = chartData[activeChart as keyof typeof chartData]
    if (!currentData || currentData.length === 0) return 0
    return Math.min(...currentData.map(item => item.value))
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              {getChartTitle()}
            </CardTitle>
            
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnimated(!animated)}
                className={animated ? 'bg-blue-100 text-blue-700' : ''}
              >
                {animated ? 'Animasi On' : 'Animasi Off'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Chart Controls */}
          <div className="mb-6 space-y-4">
            {/* Chart Type Selector */}
            <div className="flex flex-wrap gap-2">
              {chartTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <Button
                    key={type.id}
                    variant={chartType === type.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setChartType(type.id as 'bar' | 'line' | 'area' | 'pie')}
                    className="flex items-center"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {type.label}
                  </Button>
                )
              })}
            </div>

            {/* Data Selector */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeChart === 'category' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveChart('category')}
              >
                Kategori
              </Button>
              <Button
                variant={activeChart === 'status' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveChart('status')}
              >
                Status
              </Button>
              <Button
                variant={activeChart === 'month' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveChart('month')}
              >
                Bulan
              </Button>
              <Button
                variant={activeChart === 'role' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveChart('role')}
              >
                Role
              </Button>
              <Button
                variant={activeChart === 'trend' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveChart('trend')}
              >
                Trend
              </Button>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-6">
            {renderChart()}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{getTotalValue()}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{getAverageValue()}</div>
              <div className="text-sm text-gray-600">Rata-rata</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{getMaxValue()}</div>
              <div className="text-sm text-gray-600">Maksimal</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{getMinValue()}</div>
              <div className="text-sm text-gray-600">Minimal</div>
            </div>
          </div>

          {/* Data Table */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Data Detail</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Nama</th>
                    <th className="text-right py-2">Nilai</th>
                    <th className="text-right py-2">Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData[activeChart as keyof typeof chartData]?.map((item, index) => {
                    const percentage = ((item.value / getTotalValue()) * 100).toFixed(1)
                    return (
                      <tr key={index} className="border-b">
                        <td className="py-2 flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          {item.name}
                        </td>
                        <td className="text-right py-2">{item.value}</td>
                        <td className="text-right py-2">{percentage}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
