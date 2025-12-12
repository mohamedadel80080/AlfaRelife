import { useState, useEffect } from 'react'
import { HealthcareProfessional, ApiResponse } from '@/types/profile'

export function useProfile() {
  const [profile, setProfile] = useState<HealthcareProfessional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔄 Fetching profile from API...')
      
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const data: ApiResponse<HealthcareProfessional> = await response.json()
      console.log('📊 API Response Data:', data)

      if (data.success && data.data) {
        console.log('✅ Profile loaded successfully:', data.data.firstName, data.data.lastName)
        setProfile(data.data)
        setError(null)
      } else {
        console.error('❌ API returned error:', data.error)
        throw new Error(data.error || 'Failed to fetch profile')
      }
    } catch (err) {
      console.error('💥 Error in fetchProfile:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching your profile'
      setError(errorMessage)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const refetch = () => {
    console.log('🔄 Manual refetch triggered')
    fetchProfile()
  }

  const clearError = () => {
    setError(null)
  }

  return {
    profile,
    isLoading,
    error,
    refetch,
    clearError
  }
}