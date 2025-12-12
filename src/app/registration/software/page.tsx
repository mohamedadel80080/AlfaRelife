'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Monitor, CheckCircle, Plus, X } from 'lucide-react'

interface Software {
  id: number
  title: string
  selected: boolean
}

interface SoftwareResponse {
  success: boolean
  data: Software[]
}

export default function SoftwarePage() {
  const [softwares, setSoftwares] = useState<Software[]>([])
  const [selectedSoftwares, setSelectedSoftwares] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch software data
  useEffect(() => {
    const fetchSoftwares = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/registration/software')
        const data: SoftwareResponse = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch software')
        }

        if (data.success && data.data) {
          setSoftwares(data.data)
          // Set initial selected software from API data
          const initialSelected = data.data
            .filter(software => software.selected)
            .map(software => software.id)
          setSelectedSoftwares(initialSelected)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSoftwares()
  }, [])

  const handleSoftwareToggle = (softwareId: number) => {
    setSelectedSoftwares(prev => 
      prev.includes(softwareId)
        ? prev.filter(id => id !== softwareId)
        : [...prev, softwareId]
    )
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // Get the titles of selected software
      const selectedSoftwareTitles = softwares
        .filter(software => selectedSoftwares.includes(software.id))
        .map(software => software.title)

      const response = await fetch('/api/registration/software', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ softwares: selectedSoftwareTitles })
      })

      const data: SoftwareResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update software')
      }

      if (data.success) {
        // Update the local state with the new selection
        setSoftwares(data.data)
      }

      // Navigate to next page or show success message
      console.log('Software saved successfully:', selectedSoftwareTitles)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save software')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading software options...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center text-red-600 mb-4">
              <X className="h-8 w-8" />
              <span className="ml-2">Error loading software</span>
            </div>
            <p className="text-red-700">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Select Software Experience
                <Badge variant="secondary" className="ml-2">
                  {selectedSoftwares.length} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {softwares.map((software) => (
                  <div
                    key={software.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSoftwares.includes(software.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSoftwareToggle(software.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{software.title}</span>
                      {selectedSoftwares.includes(software.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-6">
                <div className="text-sm text-gray-600">
                  Select all pharmacy software you have experience with
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSoftwares([])}
                    disabled={isSaving}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSaving || selectedSoftwares.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Continue ({selectedSoftwares.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}