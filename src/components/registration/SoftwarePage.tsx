'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Monitor, 
  ChevronRight, 
  CheckCircle, 
  Cpu,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

interface SoftwareOption {
  id: number
  title: string
  selected: boolean
}

interface SoftwarePageProps {
  onNext: () => void
  onBack?: () => void
}

export function SoftwarePage({ onNext, onBack }: SoftwarePageProps) {
  const [softwares, setSoftwares] = useState<SoftwareOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Mock software data - in real app, this would come from API
  const mockSoftwares: SoftwareOption[] = [
    { id: 1, title: "software1", selected: false },
    { id: 2, title: "software2", selected: false },
    { id: 3, title: "Kroll", selected: false },
    { id: 4, title: "Propel", selected: false },
    { id: 5, title: "HealthWatch", selected: false }
  ]

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setSoftwares(mockSoftwares)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSoftwareToggle = (id: number) => {
    setSoftwares(prev => 
      prev.map(software => 
        software.id === id ? { ...software, selected: !software.selected } : software
      )
    )
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // Prepare data for API submission
      const selectedSoftwares = softwares.filter(software => software.selected)
      const submissionData = {
        softwares: selectedSoftwares.map((software, index) => ({
          id: software.id,
          title: software.title
        }))
      }

      // Simulate API call
      console.log('Submitting softwares:', submissionData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Softwares submitted successfully!')
      onNext()
    } catch (err) {
      console.error('Error submitting softwares:', err)
      setError('Failed to save softwares. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    
    // Refetch data
    setTimeout(() => {
      setSoftwares(mockSoftwares)
      setIsLoading(false)
    }, 500)
  }

  const selectedCount = softwares.filter(software => software.selected).length

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
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Software</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Loading Software
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Select Software</h1>
              <span className="text-sm text-gray-500">
                Step 4 of 5
              </span>
            </div>
            <Progress value={80} className="h-3" />
          </div>

          {/* Software Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Software Experience
                <Badge variant="secondary" className="ml-2">
                  {selectedCount} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {softwares.map((software) => (
                  <div
                    key={software.id}
                    onClick={() => handleSoftwareToggle(software.id)}
                    className={`
                      relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${software.selected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${software.selected 
                            ? 'border-blue-500 bg-blue-600' 
                            : 'border-gray-300 bg-white'
                          }
                        `}>
                          {software.selected && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className={`
                          font-medium
                          ${software.selected 
                            ? 'text-blue-700' 
                            : 'text-gray-700'
                          }
                        `}>
                          {software.title}
                        </span>
                      </div>
                      {software.selected && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isSaving}
              className="px-8"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving || selectedCount === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue to Skills
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}