import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, clearAuth } from '@/lib/api'

export function useAuth() {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
    setIsLoading(false)
    
    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuthStatus()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const checkAuthStatus = () => {
    setIsAuth(isAuthenticated())
  }

  const logout = () => {
    clearAuth()
    setIsAuth(false)
    router.push('/login')
  }

  return {
    isAuth,
    isLoading,
    logout,
    checkAuthStatus
  }
}
