'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

interface TestResult {
  id: string
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: string
}

interface MobileTestSuiteProps {
  className?: string
}

export function MobileTestSuite({ className }: MobileTestSuiteProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [currentViewport, setCurrentViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  const [showDetails, setShowDetails] = useState(false)

  const viewportSizes = {
    mobile: { width: 375, height: 667, name: 'Mobile' },
    tablet: { width: 768, height: 1024, name: 'Tablet' },
    desktop: { width: 1920, height: 1080, name: 'Desktop' }
  }

  const runTests = async () => {
    setIsRunning(true)
    setResults([])

    const testResults: TestResult[] = []

    // Test 1: Viewport Detection
    testResults.push({
      id: 'viewport-detection',
      name: 'Viewport Detection',
      status: 'pass',
      message: 'Viewport berhasil terdeteksi',
      details: `Current viewport: ${window.innerWidth}x${window.innerHeight}`
    })

    // Test 2: Touch Support
    testResults.push({
      id: 'touch-support',
      name: 'Touch Support',
      status: 'ontouchstart' in window ? 'pass' : 'fail',
      message: 'ontouchstart' in window ? 'Touch support tersedia' : 'Touch support tidak tersedia',
      details: 'ontouchstart' in window ? 'Device mendukung touch events' : 'Device tidak mendukung touch events'
    })

    // Test 3: Responsive Images
    const images = document.querySelectorAll('img')
    const responsiveImages = Array.from(images).filter(img => 
      img.hasAttribute('srcset') || img.hasAttribute('sizes') || img.classList.contains('responsive')
    )
    testResults.push({
      id: 'responsive-images',
      name: 'Responsive Images',
      status: responsiveImages.length > 0 ? 'pass' : 'warning',
      message: `${responsiveImages.length} gambar responsif ditemukan`,
      details: `Total gambar: ${images.length}, Responsif: ${responsiveImages.length}`
    })

    // Test 4: Font Size
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    testResults.push({
      id: 'font-size',
      name: 'Font Size',
      status: rootFontSize >= 16 ? 'pass' : 'warning',
      message: `Font size: ${rootFontSize}px`,
      details: rootFontSize >= 16 ? 'Font size memadai untuk mobile' : 'Font size mungkin terlalu kecil untuk mobile'
    })

    // Test 5: Touch Target Size
    const buttons = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]')
    const smallTargets = Array.from(buttons).filter(btn => {
      const rect = btn.getBoundingClientRect()
      return rect.width < 44 || rect.height < 44
    })
    testResults.push({
      id: 'touch-targets',
      name: 'Touch Target Size',
      status: smallTargets.length === 0 ? 'pass' : 'warning',
      message: `${smallTargets.length} target touch terlalu kecil`,
      details: `Total buttons: ${buttons.length}, Kecil: ${smallTargets.length}`
    })

    // Test 6: Viewport Meta Tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    testResults.push({
      id: 'viewport-meta',
      name: 'Viewport Meta Tag',
      status: viewportMeta ? 'pass' : 'fail',
      message: viewportMeta ? 'Viewport meta tag ditemukan' : 'Viewport meta tag tidak ditemukan',
      details: viewportMeta ? viewportMeta.getAttribute('content') || undefined : 'Tambahkan meta viewport tag'
    })

    // Test 7: CSS Media Queries
    const hasMediaQueries = document.querySelector('style[media]') || 
      Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some(rule => 
            rule.type === CSSRule.MEDIA_RULE
          )
        } catch {
          return false
        }
      })
    testResults.push({
      id: 'media-queries',
      name: 'CSS Media Queries',
      status: hasMediaQueries ? 'pass' : 'warning',
      message: hasMediaQueries ? 'Media queries ditemukan' : 'Media queries tidak ditemukan',
      details: hasMediaQueries ? 'CSS responsive design terdeteksi' : 'Tambahkan media queries untuk responsive design'
    })

    // Test 8: Performance
    const performance = window.performance
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0
    testResults.push({
      id: 'performance',
      name: 'Performance',
      status: loadTime < 3000 ? 'pass' : 'warning',
      message: `Load time: ${loadTime.toFixed(2)}ms`,
      details: loadTime < 3000 ? 'Performance baik' : 'Performance perlu dioptimasi'
    })

    // Test 9: Accessibility
    const hasAltText = Array.from(document.querySelectorAll('img')).every(img => 
      img.hasAttribute('alt')
    )
    testResults.push({
      id: 'accessibility',
      name: 'Accessibility',
      status: hasAltText ? 'pass' : 'warning',
      message: hasAltText ? 'Semua gambar memiliki alt text' : 'Beberapa gambar tidak memiliki alt text',
      details: hasAltText ? 'Accessibility baik' : 'Tambahkan alt text untuk semua gambar'
    })

    // Test 10: Mobile Navigation
    const mobileNav = document.querySelector('[data-mobile-nav]') || 
      document.querySelector('.mobile-nav') ||
      document.querySelector('.hamburger')
    testResults.push({
      id: 'mobile-nav',
      name: 'Mobile Navigation',
      status: mobileNav ? 'pass' : 'warning',
      message: mobileNav ? 'Mobile navigation ditemukan' : 'Mobile navigation tidak ditemukan',
      details: mobileNav ? 'Mobile navigation tersedia' : 'Tambahkan mobile navigation'
    })

    setResults(testResults)
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'fail':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800'
      case 'fail':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pass':
        return 'Pass'
      case 'fail':
        return 'Fail'
      case 'warning':
        return 'Warning'
      default:
        return 'Unknown'
    }
  }

  const getSummary = () => {
    const pass = results.filter(r => r.status === 'pass').length
    const fail = results.filter(r => r.status === 'fail').length
    const warning = results.filter(r => r.status === 'warning').length
    const total = results.length

    return { pass, fail, warning, total }
  }

  const summary = getSummary()

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <DevicePhoneMobileIcon className="w-5 h-5 mr-2" />
              Mobile Test Suite
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                {showDetails ? 'Sembunyikan' : 'Tampilkan'} Detail
              </Button>
              <Button
                onClick={runTests}
                loading={isRunning}
                disabled={isRunning}
              >
                <Cog6ToothIcon className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Tests'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Viewport Selector */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Viewport</h4>
            <div className="flex space-x-2">
              {Object.entries(viewportSizes).map(([key, size]) => (
                <Button
                  key={key}
                  variant={currentViewport === key ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentViewport(key as 'mobile' | 'tablet' | 'desktop')}
                >
                  {key === 'mobile' && <DevicePhoneMobileIcon className="w-4 h-4 mr-2" />}
                  {key === 'tablet' && <DeviceTabletIcon className="w-4 h-4 mr-2" />}
                  {key === 'desktop' && <ComputerDesktopIcon className="w-4 h-4 mr-2" />}
                  {size.name} ({size.width}x{size.height})
                </Button>
              ))}
            </div>
          </div>

          {/* Test Results Summary */}
          {results.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Summary</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{summary.pass}</div>
                  <div className="text-sm text-green-800">Pass</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{summary.warning}</div>
                  <div className="text-sm text-yellow-800">Warning</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{summary.fail}</div>
                  <div className="text-sm text-red-800">Fail</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{summary.total}</div>
                  <div className="text-sm text-gray-800">Total</div>
                </div>
              </div>
            </div>
          )}

          {/* Test Results */}
          {results.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Test Results</h4>
              <div className="space-y-2">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium text-sm">{result.name}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                        {showDetails && result.details && (
                          <div className="text-xs text-gray-500 mt-1">{result.details}</div>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {getStatusText(result.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {results.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Rekomendasi</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pastikan semua touch target minimal 44x44px</li>
                <li>• Gunakan font size minimal 16px untuk mobile</li>
                <li>• Implementasikan responsive images dengan srcset</li>
                <li>• Tambahkan viewport meta tag</li>
                <li>• Optimasi performance untuk mobile</li>
                <li>• Implementasikan mobile navigation</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
