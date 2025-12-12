'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, CheckCircle, Plus, X } from 'lucide-react'

interface Skill {
  id: number
  title: string
  selected: boolean
}

interface SkillsResponse {
  success: boolean
  data: Skill[]
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch skills data
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/registration/skills')
        const data: SkillsResponse = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch skills')
        }

        if (data.success && data.data) {
          setSkills(data.data)
          // Set initial selected skills from API data
          const initialSelected = data.data
            .filter(skill => skill.selected)
            .map(skill => skill.id)
          setSelectedSkills(initialSelected)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const handleSkillToggle = (skillId: number) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // Get the titles of selected skills
      const selectedSkillTitles = skills
        .filter(skill => selectedSkills.includes(skill.id))
        .map(skill => skill.title)

      const response = await fetch('/api/registration/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skills: selectedSkillTitles })
      })

      const data: SkillsResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update skills')
      }

      if (data.success) {
        // Update the local state with the new selection
        setSkills(data.data)
      }

      // Navigate to next page or show success message
      console.log('Skills saved successfully:', selectedSkillTitles)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save skills')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading professional skills...</span>
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
              <span className="ml-2">Error loading skills</span>
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
                <Award className="h-5 w-5" />
                Professional Skills
                <Badge variant="secondary" className="ml-2">
                  {selectedSkills.length} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSkills.includes(skill.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSkillToggle(skill.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{skill.title}</span>
                      {selectedSkills.includes(skill.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-6">
                <div className="text-sm text-gray-600">
                  Select all professional skills you possess
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSkills([])}
                    disabled={isSaving}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSaving || selectedSkills.length === 0}
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
                        Continue ({selectedSkills.length})
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