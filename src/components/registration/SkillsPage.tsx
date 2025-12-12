'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Award, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRegistrationData } from '@/hooks/useRegistrationData'

interface SkillOption {
  id: number
  title: string
  selected: boolean
}

interface SkillsResponse {
  data: SkillOption[]
}

export function SkillsPage() {
  const [skills, setSkills] = useState<SkillOption[]>([])
  const [selectedSkills, setSelectedSkills] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { registrationData, updateRegistrationData } = useRegistrationData()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Mock API call - in real app, this would be from your API
      const mockResponse: SkillsResponse = {
        data: [
          { id: 4, title: "Blister pack", selected: false },
          { id: 5, title: "Additional Prescribing Authorization", selected: false },
          { id: 6, title: "Cash Trained", selected: false },
          { id: 7, title: "Diabetes Education", selected: false },
          { id: 8, title: "Injection Certified", selected: false },
          { id: 9, title: "Medication Review", selected: false },
          { id: 10, title: "Methadone/Suboxone", selected: false },
          { id: 11, title: "Minor Ailment Prescribing", selected: false },
          { id: 12, title: "Smoking Cessation", selected: false },
          { id: 13, title: "Travel Health Education", selected: false }
        ]
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setSkills(mockResponse.data)
      
      // Load previously selected skills from registration data
      const savedSkills = registrationData.skills || [4, 6, 8, 9] // Some pre-selected skills
      setSelectedSkills(savedSkills)
      
    } catch (err) {
      console.error('Error fetching skills:', err)
      setError('Failed to load skill options')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSkill = (skillId: number) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
  }

  const handleNext = async () => {
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill')
      return
    }

    setIsSaving(true)
    
    try {
      // Save to registration data
      updateRegistrationData({ skills: selectedSkills })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to next page
      window.location.href = '/registration/software'
    } catch (err) {
      console.error('Error saving skills:', err)
      setError('Failed to save skill selection')
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    window.location.href = '/registration/languages'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading skills...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Skills</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-y-2">
          <Button onClick={fetchSkills} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Award className="h-4 w-4 mr-2" />
            Retry Loading Skills
          </Button>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Languages
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold text-blue-900">Select Skills</h1>
              <span className="text-sm text-gray-500">Step 6 of 7</span>
            </div>
            <Progress value={86} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">Choose your professional healthcare skills</p>
          </div>

          {/* Skills Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Professional Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedSkills.includes(skill.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                          selectedSkills.includes(skill.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {skill.title.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{skill.title}</span>
                      </div>
                      {selectedSkills.includes(skill.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedSkills.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>{selectedSkills.length}</strong> skill{selectedSkills.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSaving || selectedSkills.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue to Software
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}