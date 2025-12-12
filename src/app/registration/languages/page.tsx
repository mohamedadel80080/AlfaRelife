'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Languages, CheckCircle, Plus, X } from 'lucide-react'

interface Language {
  id: number
  title: string
  selected: boolean
}

interface LanguagesResponse {
  success: boolean
  data: Language[]
}

export default function LanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch languages data
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/registration/languages')
        const data: LanguagesResponse = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch languages')
        }

        if (data.success && data.data) {
          setLanguages(data.data)
          // Set initial selected languages from API data
          const initialSelected = data.data
            .filter(lang => lang.selected)
            .map(lang => lang.id)
          setSelectedLanguages(initialSelected)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLanguages()
  }, [])

  const handleLanguageToggle = (languageId: number) => {
    setSelectedLanguages(prev => 
      prev.includes(languageId)
        ? prev.filter(id => id !== languageId)
        : [...prev, languageId]
    )
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // Get the titles of selected languages
      const selectedLanguageTitles = languages
        .filter(lang => selectedLanguages.includes(lang.id))
        .map(lang => lang.title)

      const response = await fetch('/api/registration/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ languages: selectedLanguageTitles })
      })

      const data: LanguagesResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update languages')
      }

      if (data.success) {
        // Update the local state with the new selection
        setLanguages(data.data)
      }

      // Navigate to next page or show success message
      console.log('Languages saved successfully:', selectedLanguageTitles)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save languages')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading languages...</span>
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
              <span className="ml-2">Error loading languages</span>
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
                <Languages className="h-5 w-5" />
                Select Languages
                <Badge variant="secondary" className="ml-2">
                  {selectedLanguages.length} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {languages.map((language) => (
                  <div
                    key={language.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLanguages.includes(language.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleLanguageToggle(language.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{language.title}</span>
                      {selectedLanguages.includes(language.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-6">
                <div className="text-sm text-gray-600">
                  Select all languages you speak professionally
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedLanguages([])}
                    disabled={isSaving}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSaving || selectedLanguages.length === 0}
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
                        Continue ({selectedLanguages.length})
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