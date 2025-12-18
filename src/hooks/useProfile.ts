import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchProfile, ProfileData } from '@/lib/api'

export function useProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔄 Fetching profile from API...')
      
      const response = await fetchProfile()
      console.log('📊 API Response Data:', response)

      if (response.data) {
        console.log('✅ Profile loaded successfully:', response.data.first_name, response.data.last_name)
        setProfile(response.data)
        setError(null)
      } else {
        console.error('❌ API returned no data')
        throw new Error('No profile data returned')
      }
    } catch (err) {
      console.error('💥 Error in loadProfile:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching your profile'
      setError(errorMessage)
      setProfile(null)
      
      // If authentication error, redirect to login
      if (errorMessage.includes('authentication') || errorMessage.includes('login')) {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const refetch = () => {
    console.log('🔄 Manual refetch triggered')
    loadProfile()
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