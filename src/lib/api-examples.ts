/**
 * Example: How to use the API utility in your components
 */

import { apiRequest, getAuthToken, isAuthenticated, clearAuth } from '@/lib/api'

// ============================================
// Example 1: Check if user is authenticated
// ============================================
export function MyProtectedComponent() {
  if (!isAuthenticated()) {
    // Redirect to login
    window.location.href = '/login'
    return null
  }

  return <div>Protected content</div>
}

// ============================================
// Example 2: Make an authenticated GET request
// ============================================
export async function fetchUserProfile() {
  try {
    const profile = await apiRequest('/user/profile', {
      method: 'GET'
    })
    console.log('User profile:', profile)
    return profile
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    throw error
  }
}

// ============================================
// Example 3: Make an authenticated POST request
// ============================================
export async function updateUserSettings(settings: any) {
  try {
    const result = await apiRequest('/user/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    })
    console.log('Settings updated:', result)
    return result
  } catch (error) {
    console.error('Failed to update settings:', error)
    throw error
  }
}

// ============================================
// Example 4: Logout functionality
// ============================================
export function handleLogout() {
  clearAuth()
  window.location.href = '/login'
}

// ============================================
// Example 5: Using in a React component
// ============================================
import { useState, useEffect } from 'react'

export function UserProfileComponent() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiRequest('/user/profile')
        setProfile(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!profile) return <div>No profile found</div>

  return (
    <div>
      <h1>{profile.name}</h1>
      {/* Render profile data */}
    </div>
  )
}

// ============================================
// Example 6: Custom API hook
// ============================================
export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await apiRequest<T>(endpoint)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint])

  return { data, loading, error }
}

// Usage:
// const { data, loading, error } = useApi('/user/profile')

// ============================================
// Example 7: Handle 401 Unauthorized
// ============================================
export async function fetchWithAuthCheck(endpoint: string) {
  try {
    return await apiRequest(endpoint)
  } catch (error) {
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      // Token expired or invalid
      clearAuth()
      window.location.href = '/login'
    }
    throw error
  }
}
