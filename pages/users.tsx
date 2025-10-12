'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Layout } from '@/components/layout/Layout'
import { UsersTable } from '@/components/admin/UsersTable'

export default function UsersPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])


  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Users Table */}
        <UsersTable />
      </div>
    </Layout>
  )
}