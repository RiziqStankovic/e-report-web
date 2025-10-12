'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { authApi } from '@/lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('e-report-token')
    if (token) {
      authApi.getProfile()
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem('e-report-token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password })
      localStorage.setItem('e-report-token', response.token)
      localStorage.setItem('e-report-user', JSON.stringify(response.user))
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('e-report-token')
    localStorage.removeItem('e-report-user')
    setUser(null)
    authApi.logout().catch(() => {})
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
