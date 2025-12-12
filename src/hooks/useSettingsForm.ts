import { useState, useEffect } from 'react'
import { HealthcareProfessional, SettingsFormData, ApiResponse } from '@/types/profile'

export function useSettingsForm() {
  const [profile, setProfile] = useState<HealthcareProfessional | null>(null)
  const [formData, setFormData] = useState<SettingsFormData>({
    languages: [],
    skills: [],
    softwares: [],
    experience: undefined
  })
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedSoftwares, setSelectedSoftwares] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Custom input states
  const [customLanguage, setCustomLanguage] = useState('')
  const [customSkill, setCustomSkill] = useState('')
  const [customSoftware, setCustomSoftware] = useState('')
  const [showLanguageInput, setShowLanguageInput] = useState(false)
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [showSoftwareInput, setShowSoftwareInput] = useState(false)

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch profile
        const profileResponse = await fetch('/api/user/profile')
        const profileData: ApiResponse<HealthcareProfessional> = await profileResponse.json()

        if (profileResponse.ok && profileData.success && profileData.data) {
          setProfile(profileData.data)
          setFormData({
            experience: profileData.data.experience || undefined
          })
        }

        // Fetch languages
        const languagesResponse = await fetch('/api/user/settings/languages')
        const languagesData: ApiResponse<string[]> = await languagesResponse.json()

        if (languagesResponse.ok && languagesData.success && languagesData.data) {
          setSelectedLanguages(languagesData.data)
        }

        // Fetch skills
        const skillsResponse = await fetch('/api/user/settings/skills')
        const skillsData: ApiResponse<string[]> = await skillsResponse.json()

        if (skillsResponse.ok && skillsData.success && skillsData.data) {
          setSelectedSkills(skillsData.data)
        }

        // Fetch softwares
        const softwaresResponse = await fetch('/api/user/settings/softwares')
        const softwaresData: ApiResponse<string[]> = await softwaresResponse.json()

        if (softwaresResponse.ok && softwaresData.success && softwaresData.data) {
          setSelectedSoftwares(softwaresData.data)
        }
      } catch (err) {
        console.error('Error fetching settings:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    switch (field) {
      case 'customLanguage':
        setCustomLanguage(value)
        break
      case 'customSkill':
        setCustomSkill(value)
        break
      case 'customSoftware':
        setCustomSoftware(value)
        break
      case 'showLanguageInput':
        setShowLanguageInput(value)
        break
      case 'showSkillInput':
        setShowSkillInput(value)
        break
      case 'showSoftwareInput':
        setShowSoftwareInput(value)
        break
      case 'experience':
        setFormData(prev => ({
          ...prev,
          experience: value
        }))
        break
    }
  }

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    )
  }

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleSoftwareToggle = (software: string) => {
    setSelectedSoftwares(prev => 
      prev.includes(software)
        ? prev.filter(s => s !== software)
        : [...prev, software]
    )
  }

  const addCustomLanguage = () => {
    if (customLanguage.trim() && !selectedLanguages.includes(customLanguage.trim())) {
      setSelectedLanguages(prev => [...prev, customLanguage.trim()])
      setCustomLanguage('')
    }
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()])
      setCustomSkill('')
    }
  }

  const addCustomSoftware = () => {
    if (customSoftware.trim() && !selectedSoftwares.includes(customSoftware.trim())) {
      setSelectedSoftwares(prev => [...prev, customSoftware.trim()])
      setCustomSoftware('')
    }
  }

  const removeLanguage = (language: string) => {
    setSelectedLanguages(prev => prev.filter(l => l !== language))
  }

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill))
  }

  const removeSoftware = (software: string) => {
    setSelectedSoftwares(prev => prev.filter(s => s !== software))
  }

  const handleSubmit = async () => {
    setIsSaving(true)

    try {
      // Update languages
      await fetch('/api/user/settings/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ languages: selectedLanguages })
      })

      // Update skills
      await fetch('/api/user/settings/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skills: selectedSkills })
      })

      // Update softwares
      await fetch('/api/user/settings/softwares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ softwares: selectedSoftwares })
      })

      // Update experience
      if (profile) {
        await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ experience: formData.experience })
        })
      }

      return true
    } catch (err) {
      console.error('Error saving settings:', err)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/account', {
        method: 'DELETE'
      })

      const data: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account')
      }

      // Redirect to home page after successful deletion
      window.location.href = '/'
    } catch (err) {
      console.error('Error deleting account:', err)
      throw err
    }
  }

  return {
    profile,
    formData,
    selectedLanguages,
    selectedSkills,
    selectedSoftwares,
    customLanguage,
    customSkill,
    customSoftware,
    showLanguageInput,
    showSkillInput,
    showSoftwareInput,
    isLoading,
    isSaving,
    handleInputChange,
    handleLanguageToggle,
    handleSkillToggle,
    handleSoftwareToggle,
    addCustomLanguage,
    addCustomSkill,
    addCustomSoftware,
    removeLanguage,
    removeSkill,
    removeSoftware,
    handleSubmit,
    handleDeleteAccount
  }
}