'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ConfirmDialog } from './ConfirmDialog'
import { 
  Settings, 
  Languages, 
  Award, 
  Monitor, 
  Calendar,
  Plus,
  X,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { SettingsFormData, LANGUAGES, SKILLS, SOFTWARES } from '@/types/profile'
import { useSettingsForm } from '@/hooks/useSettingsForm'

export function SettingsForm() {
  const {
    profile,
    formData,
    isLoading,
    isSaving,
    selectedLanguages,
    selectedSkills,
    selectedSoftwares,
    customLanguage,
    customSkill,
    customSoftware,
    showLanguageInput,
    showSkillInput,
    showSoftwareInput,
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
  } = useSettingsForm()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading settings...</span>
      </div>
    )
  }

  if (!profile || !formData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Settings</h3>
        <p className="text-gray-600">Unable to load your account settings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Languages Spoken
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {LANGUAGES.map((language) => (
              <Badge
                key={language}
                variant={selectedLanguages.includes(language) ? "default" : "outline"}
                className={`cursor-pointer justify-center py-2 ${
                  selectedLanguages.includes(language) 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleLanguageToggle(language)}
              >
                {language}
              </Badge>
            ))}
          </div>

          {/* Custom Language Input */}
          <div className="flex gap-2">
            {showLanguageInput ? (
              <>
                <Input
                  placeholder="Enter custom language"
                  value={customLanguage}
                  onChange={(e) => handleInputChange('customLanguage', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomLanguage()}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addCustomLanguage}
                  disabled={!customLanguage.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleInputChange('showLanguageInput', false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleInputChange('showLanguageInput', true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Language
              </Button>
            )}
          </div>

          {/* Selected Languages Display */}
          {selectedLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedLanguages.map((language) => (
                <Badge
                  key={language}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => removeLanguage(language)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Professional Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {SKILLS.map((skill) => (
              <Badge
                key={skill}
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                className={`cursor-pointer justify-center py-2 ${
                  selectedSkills.includes(skill) 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSkillToggle(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Custom Skill Input */}
          <div className="flex gap-2">
            {showSkillInput ? (
              <>
                <Input
                  placeholder="Enter custom skill"
                  value={customSkill}
                  onChange={(e) => handleInputChange('customSkill', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addCustomSkill}
                  disabled={!customSkill.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleInputChange('showSkillInput', false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleInputChange('showSkillInput', true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Skill
              </Button>
            )}
          </div>

          {/* Selected Skills Display */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Software */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Software Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {SOFTWARES.map((software) => (
              <Badge
                key={software}
                variant={selectedSoftwares.includes(software) ? "default" : "outline"}
                className={`cursor-pointer justify-center py-2 ${
                  selectedSoftwares.includes(software) 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSoftwareToggle(software)}
              >
                {software}
              </Badge>
            ))}
          </div>

          {/* Custom Software Input */}
          <div className="flex gap-2">
            {showSoftwareInput ? (
              <>
                <Input
                  placeholder="Enter custom software"
                  value={customSoftware}
                  onChange={(e) => handleInputChange('customSoftware', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomSoftware()}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addCustomSoftware}
                  disabled={!customSoftware.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleInputChange('showSoftwareInput', false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleInputChange('showSoftwareInput', true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Software
              </Button>
            )}
          </div>

          {/* Selected Software Display */}
          {selectedSoftwares.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSoftwares.map((software) => (
                <Badge
                  key={software}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {software}
                  <button
                    type="button"
                    onClick={() => removeSoftware(software)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Professional Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={formData.experience || ''}
              onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || undefined)}
              placeholder="Enter years of experience"
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Profile Completion</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${profile.completed ? 100 : 75}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{profile.completed ? '100%' : '75%'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Account Status</Label>
              <Badge className={
                profile.status === 'active' ? 'bg-green-100 text-green-800' :
                profile.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }>
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isSaving}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Settings...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
        confirmText="Delete Account"
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        variant="destructive"
      />
    </div>
  )
}